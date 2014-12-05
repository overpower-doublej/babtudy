import mongodb = require('mongodb');
import extend = require('extend');
import mongo = require('./mongo');
import ObjectId = mongodb.ObjectID;
import config = require('../config');
import schema = require('./schema');
import User = schema.User;
import Post = schema.Post;

var dbName = 'bobtudy';
var collName = 'user';

var db: mongodb.Db;
var user: mongodb.Collection;

export function findById(_id: string, callback: (user: User) => void) {
    user.findOne({ _id: new ObjectId(_id) }, (err, result) => {
        if (err) return console.error(err);

        callback(result);
    })
}

export function findRegIds(userIds: string[], callback: (regIds: string[]) => void) {
    var selector = {
        $or: []
    };
    userIds.forEach((userId) => {
        selector.$or.push({ _id: userId });
    });

    user.find(selector, { regId: 1 }).toArray((err, results: { _id: string; regId: string }[]) => {
        if (err) return console.error(err);

        var regIds = [];
        results.forEach((result) => {
            regIds.push(result.regId);
        });

        callback(regIds);
    });
}

export function insert(newUser: User, callback: (result) => void) {
    user.insert(newUser, { w: 1 }, (err, result) => {
        if (err) return console.dir(err);

        callback(result);
    });
}

export function update(updatedUser: User, callback: (result) => void) {
    user.update({ _id: updatedUser._id }, { $set: updatedUser }, (err, result) => {
        if (err) return console.error(err);
        callback(result);
    });
}




// connect to bobtudy db
mongo.getDb(dbName, (_db) => {
    db = _db;
    db.collection(collName, (err, coll) => {
        if (err) return console.dir(err);
        // get collection post
        user = coll;
    });
});