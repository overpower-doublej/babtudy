import mongodb = require('mongodb');
import extend = require('extend');
import mongo = require('./mongo');

var db: mongodb.Db;
var log: mongodb.Collection;

// Testing usage only. Store callback functions
var callbacks: Function[] = [];
var isConnected: boolean = false;

export class Doc implements IDoc {
    _id: string;        // ISO
    isError: boolean;    // if true, error
    isChecked: boolean;

    constructor(isError: boolean) {
        this._id = new Date().toISOString();
        this.isError = isError;

        if (isError)
            this.isChecked = false;
    }
}

export interface IDoc {
    _id: string;            //ISO date string
    isError?: boolean;      // if true, error
    isChecked?: boolean;
}

/**
 * Insert one record into log collection
 */
export function insert(isError: boolean, callback?: (result: any) => void) {
    var doc = new Doc(isError);

    log.insert(doc, { w: 1 }, (err, result) => {
        if (err) return console.dir(err);

        if (callback)
            callback(result);
    });
}

/**
 * Fetch log from mongodb.
 * Parameter from is ISO date string
 */
export function fetchLog(from: string, num: number, callback: (logs: Doc[]) => void): void {
    log.find({ _id: { $lt: from } }, { limit: num, sort: [['_id', 'desc']] }).toArray((err, results) => {
        if (err) return console.error(err);
        callback(results);
    });
}

/**
 * Fetch error log
 */
export function fetchErrLog(callback: (logs: Doc[]) => void): void {
    log.find({
        $and: [
            { isError: true },
            { isChecked: false }]
    },
        { sort: [['_id', 'asc']] }).toArray((err, results) => {
            if (err) return console.error(err);
            callback(results);
        });
}

export function getLogCount(callback: (count: number) => void): void {
    log.count((err, result: number) => {
        if (err) console.error(err);
        callback(result);
    });
}

export function setChecked(_id: string, callback: (numUpdated: any) => void): void {
    log.update(
        { _id: _id },
        { $set: { isChecked: true } },
        { w: 1 },
        (err, numUpdated) => {
            if (err) return console.error(err);
            callback(numUpdated);
        });
}

/**
 * Testing usage only. Wait until app connected to mongodb
 */
export function waitConn(callback: Function) {
    if (isConnected)
        callback();
    else
        callbacks.push(callback);
}

// connect to validator db
mongo.getDb('validator', (_db) => {
    db = _db;
    db.collection('log', (err, coll) => {
        if (err) return console.dir(err);
        // get collection log
        log = coll;
        // connected
        isConnected = true;
        console.log('Collection "log" connected');
        // call callback functions
        while (callbacks.length)
            callbacks.shift()();
    });
});
