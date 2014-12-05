﻿/// <reference path="../../Scripts/typings/extend/extend.d.ts" />
/// <reference path="../../Scripts/typings/mongodb/mongodb.d.ts" />
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import extend = require('extend');
import mongo = require('./mongo');
import config = require('../config');
import schema = require('./schema');
import User = schema.User;
import Post = schema.Post;

var dbName = 'bobtudy';
var collName = 'post';

var db: mongodb.Db;
var post: mongodb.Collection;

export function findById(_id: string, callback: (err, result: Post) => void) {
    post.findOne({ _id: new ObjectID(_id) }, (err, result) => {
        callback(err, result);
    });
}

/**
 * 모집글 10개를 불러옴.
 */
export function fetch(callback: (results: any[]) => void, sortByPostedDate?: boolean): void {
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
            if (err) return console.error(err);
            callback(results);
        });
}

export function fetchWhen(date: Date, callback: (results: any[]) => void, sortByPostedDate?: boolean): void {
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

export function insert(newPost: Post, callback: (err, result) => void) {
    post.insert(newPost, { w: 1 }, (err, result) => {
        callback(err, result);
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
