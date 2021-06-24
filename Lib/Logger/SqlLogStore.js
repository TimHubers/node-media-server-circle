const mysql = require('mysql');
const sql = "INSERT INTO Log (message, logLevel, timeStamp) VALUES ?";

// SQL qype of logging storage
class SqlLogStore {
    constructor(host, username, password) {
        this.connection = mysql.createConnection({
            host: host,
            user: username,
            password: password
        });
    }

    // Stores one message in sql database
    store(message, logLevel, timeStamp) {
        this.connection.connect(connection.query(sql, [message, logLevel, timeStamp]));
        this.connection.end();
    }
}

module.exports = SqlLogStore;
