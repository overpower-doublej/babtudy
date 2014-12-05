/// <reference path="../../Scripts/typings/mongodb/mongodb.d.ts" />
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import mongo = require('./mongo');
import config = require('../config');

var dbName = 'bobtudy';
var collName = 'gcm';

var db: mongodb.Db;
var gcm: mongodb.Collection;

class GcmDoc {
    regIds: string[];
    data: Object;
    date: Date;
    result: any;

    constructor(regIds, data, result) {
        this.regIds = regIds;
        this.data = data;
        this.result = result;

        this.date = new Date();
    }
}

export function insert(regIds: string[], data: Object, result: any, callback?: (result) => void) {
    var doc = new GcmDoc(regIds, data, result);
    gcm.insert(doc, { w: 1 }, (err, result) => {
        if (err) return console.error(err);
        if (callback)
            callback(result);
    });
}




// connect to bobtudy db
mongo.getDb(dbName, (_db) => {
    db = _db;
    db.collection(collName, (err, coll) => {
        if (err) return console.dir(err);
        // get collection post
        gcm = coll;
    });
});
