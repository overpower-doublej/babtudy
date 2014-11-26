/// <reference path="../scripts/typings/express-4.x/express.d.ts" />
/// <reference path="../scripts/typings/node/node.d.ts" />
/// <reference path="../scripts/typings/winston/winston.d.ts" />

// node modules
import fs = require('fs');
import path = require('path');

// express modules
import express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

// winston modules
import winston = require('winston');
var expressWinston = require('express-winston');
var winstonMongo = require('winston-mongodb').MongoDB;

// my modules
import config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.enable('trust proxy');      // To get real ip

// Setup loggers
// For console, use morgan logger
app.use(logger('combined'));
// express-winston logger makes sense BEFORE the router.
// Send log to mongodb
expressWinston.requestWhitelist.push('ip');
expressWinston.requestWhitelist.push('ips');
app.use(expressWinston.logger({
    transports: [
        new winstonMongo({
            db: config.winston.mongo.dbName,
            collection: config.winston.mongo.accessLogCollName
        })
    ]
}));

// Setup router
app.use('/', require('./route/index'));

// express-winston errorLogger makes sense AFTER the router.
// Send log to mongodb
app.use(expressWinston.errorLogger({
    transports: [
        new winstonMongo({
            db: config.winston.mongo.dbName,
            collection: config.winston.mongo.errLogCollName
        })
    ]
}));

// Start listening
app.listen(config.port, () => {
    console.log('Web server started at port ' + config.port);
});

module.exports = app;
