// Handle function of class is used in js-logger library for the display and storage of logs
class LogHandler {
    constructor(logStore) {
        this.logStore = logStore;
    }

    // Stores message into logStore and displays log
    handle(messages, context) {
        let timeStamp = new Date();
        this.logStore.store(messages[0], context.level.name, timeStamp);

        console.log('%s [%s] - %s', timeStamp.toUTCString(), context.level.name, messages[0]);
    }
}

module.exports = LogHandler;
