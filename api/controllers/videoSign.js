const DigiSigner = require('./DigiSinger');

const fs = require('fs');
const path = require('path');
const signer = new DigiSigner();

let valueVerify = true;

const publicKey = fs.readFileSync(path.join('api/assets',
    'publicKey.pem'));

const privateKey = fs.readFileSync(path.join('api/assets',
    'privatekey.pem'))

module.exports = {

    update_stream_data: (req, res, next) => {
        let actualData = "jorrit";
        console.log(publicKey)
        let jsonSignature = JSON.parse(req.body.signature)
        const buffer = Buffer.from(jsonSignature);
        console.log(buffer);
        

        valueVerify = signer.verifySignature(publicKey, buffer, actualData);

        if(valueVerify){
            // signer.signData(privateKey, "jorrit");
            //Send http to angular to verify on client side
            res.status(200).json({ "verify" : "Controle van public/private key pair is geslaagd"});
        } else {
            res.status(400).json({"error" : "Public private key pair komt niet overeen"})
        }
    
    },

    verify_stream_data: (req, res, next) => {
        res.status(200).json({verify: valueVerify});
        // TODO add signing to response
    }
}