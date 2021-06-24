const fs = require('fs');

// SQL qype of logging storage
class FileLogStore {
    constructor(file) {
        this.file = file;
    }

    // Stores one message in sql database
    store(message, logLevel, timeStamp) {
        fs.appendFile(this.file, timeStamp + ' [' + logLevel + '] - ' + message + '\n', function (err) {
            if (err) throw err;
        });
    }
}

module.exports = FileLogStore;
