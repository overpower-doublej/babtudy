import path = require('path');

var config = {
    port: 80,
    accessLogPath: path.join(__dirname, '../log', 'access.log'),
    winston: {
        mongo: {
            dbName: 'babtudy',
            accessLogCollName: 'accessLog',
            errLogCollName: 'errLog'
        }
    },
    gcm: {
        SERVER_ACCESS_KEY: 'AIzaSyD8d4J6MnN1htX2XxSjFl9BVWOb-txMPJc'
    }
}

export = config;