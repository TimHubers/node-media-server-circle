//
//  Created by Mingliang Chen on 17/12/24.  Merry Christmas
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//

var MongoClient = require('mongodb').MongoClient;
const express = require('express'),
http = require('http'),
app = express(),
socketServer = http.createServer(app),
io = require('socket.io').listen(socketServer);

const OS = require('os');
const Package = require("../../package.json");
const server = require('../routes/server');
function cpuAverage() {

  //Initialise sum of idle and time of cores and fetch CPU info
  let totalIdle = 0, totalTick = 0;
  let cpus = OS.cpus();

  //Loop through CPU cores
  for (let i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    let cpu = cpus[i];

    //Total up the time in the cores tick
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

function percentageCPU() {
  return new Promise(function (resolve, reject) {
    let startMeasure = cpuAverage();
    setTimeout(() => {
      let endMeasure = cpuAverage();
      //Calculate the difference in idle and total time between the measures
      let idleDifference = endMeasure.idle - startMeasure.idle;
      let totalDifference = endMeasure.total - startMeasure.total;

      //Calculate the average percentage CPU usage
      let percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
      resolve(percentageCPU);
    }, 100);
  });
}

function getSessionsInfo(sessions) {
  let info = {
    inbytes: 0,
    outbytes: 0,
    rtmp: 0,
    http: 0,
    ws: 0,
  };

  for (let session of sessions.values()) {
    if (session.TAG === 'relay') continue;
    let socket = session.TAG === 'rtmp' ? session.socket : session.req.socket;
    info.inbytes += socket.bytesRead;
    info.outbytes += socket.bytesWritten;
    info.rtmp += session.TAG === 'rtmp' ? 1 : 0;
    info.http += session.TAG === 'http-flv' ? 1 : 0;
    info.ws += session.TAG === 'websocket-flv' ? 1 : 0;
  }

  return info;
}


function getInfo(req, res, next) {
  let s = this.sessions;
  percentageCPU().then((cpuload) => {
    let sinfo = getSessionsInfo(s);
    let info = {
      os: {
        arch: OS.arch(),
        platform: OS.platform(),
        release: OS.release(),
      },
      cpu: {
        num: OS.cpus().length,
        load: cpuload,
        model: OS.cpus()[0].model,
        speed: OS.cpus()[0].speed,
      },
      mem: {
        totle: OS.totalmem(),
        free: OS.freemem()
      },
      net: {
        inbytes: this.stat.inbytes + sinfo.inbytes,
        outbytes: this.stat.outbytes + sinfo.outbytes,
      },
      nodejs: {
        uptime: Math.floor(process.uptime()),
        version: process.version,
        mem: process.memoryUsage()
      },
      clients: {
        accepted: this.stat.accepted,
        active: this.sessions.size - this.idlePlayers.size,
        idle: this.idlePlayers.size,
        rtmp: sinfo.rtmp,
        http: sinfo.http,
        ws: sinfo.ws
      },
      version: Package.version
    };
    res.json(info);
  });
}

exports.getInfo = getInfo;

const uri = "mongodb+srv://admin:admin@cluster0.cdxaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var roomNumber;


client.connect(err => {
    
  // console.log(err)
  console.log("Connected to MongoDB")

  const collection = client.db("circle").collection("messages");



  io.on('connection', (socket) => {

  console.log('user connected')

      socket.on('join', function(userNickname,chatroom) {
        socket.join(chatroom)
        
        console.log(roomNumber)   

        console.log(userNickname +" : has joined the chat "  );

        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
  });

    socket.on('messagedetection', (messageContent,senderNickname, timeStamp, signature, chatroom) => {
       
        console.log(roomNumber)   
        //log the message in console 

        console.log(senderNickname+" :" +messageContent)
          //create a message object 
        let  message = {"room":roomNumber,"message":messageContent, "senderNickname":senderNickname, "timeStamp": timeStamp}
        let sign = {"signature":signature}
            // send the message to the client side  
            // console.log("test")
        saveMessage(chatroom,messageContent, senderNickname, timeStamp, signature);

        io.to(chatroom).emit('message', message, sign);
        //    io.emit('message', message, sign);
      });
      
  
    socket.on('disconnect', function() {
        console.log( ' user has left ')
        socket.broadcast.emit("userdisconnect"," user has left ") 
        // client.close();
        console.log("Client closed")
    });

  });


  async function saveMessage(roomNumber,messageContent,senderNickname, timeStamp, signature) {

      
      console.log('function saveMessage called.')
      // const collection = client.db("circle").collection("messages");

      let json = {
          room: roomNumber,
          msg: messageContent,
          nickName: senderNickname,
          time: timeStamp,
          sig: signature
      }; 

    await collection.insertOne(json);
  }

  socketServer.listen(3050, () => {
    console.log("server listening on port 3050")
  })
})
