/// <reference path="../../Scripts/typings/mongodb/mongodb.d.ts" />
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import mongo = require('./mongo');
import config = require('../config');
import schema = require('./schema');
import User = schema.User;
import Post = schema.Post;
import Access = schema.Access;

var dbName = 'bobtudy';
var collName = 'post';

var db: mongodb.Db;
var post: mongodb.Collection;


/**
 * 모집글 10개를 불러옴.
 */
export function find(callback: (err, results: any[]) => void, sortByPostedDate?: boolean): void {
    if (typeof sortByPostedDate != 'boolean')
        sortByPostedDate = false;

    var sort: string;

    if (sortByPostedDate)
        sort = 'postedDate';
    else
        sort = 'date';

    post.find({},
        {
            title: 1,
            date: 1,
            postedDate: 1,
            menu: 1
        },
        {
            limit: 10,
            sort: sort
        }).toArray((err, results) => {
            if (err) console.error(err);
            callback(err, results);
        });
}

export function findWhen(date: Date, callback: (results: any[]) => void, sortByPostedDate?: boolean): void {
    if (typeof sortByPostedDate != 'boolean')
        sortByPostedDate = false;

    var sort: string;
    var selector = {};

    if (sortByPostedDate)
        sort = 'postedDate'
    else
        sort = 'date';

    selector[sort] = { $gt: date }; // {date: {$gt: date}} or {postedDate: {$gt: date}}

    post.find(selector,
        {
            title: 1,
            date: 1,
            postedDate: 1,
            menu: 1
        },
        {
            limit: 10,
            sort: sort
        }).toArray((err, results) => {
            if (err) return console.error(err);
            callback(results);
        });
}

export function findById(_id: string, callback: (err, result: Post) => void);
export function findById(_id: ObjectID, callback: (err, result: Post) => void);
export function findById(_id: any, callback: (err, result: Post) => void) {
    if (typeof _id == 'string')
        _id = new ObjectID(_id);

    post.findOne({ _id: _id }, (err, result) => {
        callback(err, result);
    });
}

export function insert(newPost: Post, callback: (err, result) => void) {
    post.insert(newPost, { w: 1 }, (err, result) => {
        callback(err, result);
    });
}

export function pushAccess(postId: ObjectID, access: Access, callback: (result) => void) {
    post.update({ _id: postId }, { $push: { accesses: access } }, (err, result) => {
        if (err) return console.error(err);
        callback(result);
    });
}

export function findAccess(postId: ObjectID, accessId: string, callback: (access: Access) => void);
export function findAccess(postId: ObjectID, accessId: ObjectID, callback: (access: Access) => void)
export function findAccess(postId: ObjectID, accessId: any, callback: (access: Access) => void) {
    // Check argument
    if (typeof accessId == 'string')
        accessId = new ObjectID(accessId);
    // Set aggregation pipeline stages
    var stages = [
        {
            $match: { _id: postId }
        },
        {
            $project: { _id: 0, accesses: 1 }
        },
        {
            $unwind: '$accesses'
        },
        {
            $match: { 'accesses._id': accessId }
        }
    ];
    // Aggregate
    post.aggregate(stages, (err, results: any[]) => {
        if (err) return console.error(err);

        var result = results[0].accesses;
        callback(result);
    });
}

export function updateVote(postId: ObjectID, accessId: ObjectID, userId: string, vote: boolean, callback: (result) => void) {
    // Set query
    var selector = {
        _id: postId,
        'accesses._id': accessId
    };
    // Set replacement document
    var userVoteKey = 'accesses.$.votes.' + userId;
    var doc = { $set: {} };
    doc.$set[userVoteKey] = vote;
    // Update
    post.update(selector, doc, { w: 1 }, (err, result) => {
        if (err) return console.error(err);
        callback(result);
    });
}

export function setVoteResult(postId: ObjectID, accessId: ObjectID, callback?: (result) => void) {
    // Check arguments
    if (typeof callback != 'function')
        callback = () => { };

    // Set query
    var selector = {
        _id: postId,
        'accesses._id': accessId
    };

    var result = true;

    findAccess(postId, accessId, (access) => {
        var votes = access.votes;

        for (var userId in access.votes) {
            if (votes[userId] == false) {
                result = false;
                break;
            }
        }

        // Set replacement document
        var doc = { $set: { 'accesses.$.result': result } };

        // Update
        post.update(selector, doc, { w: 1 }, (err, result) => {
            if (err) return console.error(err);
            callback(result);
        });
    });
}



// connect to bobtudy db
mongo.getDb(dbName, (_db) => {
    db = _db;
    db.collection(collName, (err, coll) => {
        if (err) return console.dir(err);
        // get collection post
        post = coll;
    });
});
