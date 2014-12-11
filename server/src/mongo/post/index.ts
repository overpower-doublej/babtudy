/// <reference path="../../../Scripts/typings/mongodb/mongodb.d.ts" />
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import mongo = require('../mongo');
import config = require('../../config');
import schema = require('../schema');
import User = schema.User;
import Post = schema.Post;
import Access = schema.Access;


var dbName = 'bobtudy';
var collName = 'post';

var db: mongodb.Db;
var post: mongodb.Collection;

var getPostCollectionCallbacks = [];

export function getPostCollection(callback: (post: mongodb.Collection) => void) {
    if (post == undefined)
        getPostCollectionCallbacks.push(callback);
    else
        callback(post);
}

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
            users: 0,
            accesses: 0,
            chats: 0,
            attend: 0
        },
        {
            limit: 10,
            sort: [[sort, 'desc']]
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
            users: 0,
            accesses: 0,
            chats: 0,
            attend: 0
        },
        {
            limit: 10,
            sort: [[sort, 'desc']]
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

    post.findOne({ _id: _id }, { accesses: 0, chats: 0, attend: 0 }, (err, result) => {
        callback(err, result);
    });
}

export function insert(newPost: Post, callback: (err, result) => void) {
    post.insert(newPost, { w: 1 }, (err, result) => {
        callback(err, result);
    });
}

// Because of circular module dependency, import after export other functions
import accessFns = require('./access');
// Functions about access
export var access = accessFns;

import chatFns = require('./chat');
// Functions about chat
export var chat = chatFns;

// connect to bobtudy db
mongo.getDb(dbName, (_db) => {
    db = _db;
    db.collection(collName, (err, coll) => {
        if (err) return console.dir(err);
        // get collection post
        post = coll;

        while (getPostCollectionCallbacks.length)
            getPostCollectionCallbacks.pop()(post);
    });
});
