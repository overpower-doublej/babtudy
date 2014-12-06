/// <reference path="../../../Scripts/typings/mongodb/mongodb.d.ts" />
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import mongo = require('../mongo');
import config = require('../../config');
import schema = require('../schema');
import User = schema.User;
import Post = schema.Post;
import Chat = schema.Chat;
import Access = schema.Access;


var post: mongodb.Collection;

export function push(postId: string, userId: string, msg: string, callback: (result) => void)
export function push(postId: ObjectID, userId: string, msg: string, callback: (result) => void)
export function push(postId: any, userId: string, msg: string, callback: (result) => void) {
    // Check parameters
    if (typeof postId == 'string')
        postId = new ObjectID(postId);

    var chat = new Chat(userId, msg);
    var doc = {
        $push: {
            chats: {
                $each: [chat],
                $sort: { date: 1 }
            }
        }
    };
    post.update({ _id: postId }, doc, (err, result) => {
        if (err) return console.error(err);
        callback(result);
    });
}

export function findAfter(date: Date, postId: string, callback: (result: Chat[]) => void)
export function findAfter(date: Date, postId: ObjectID, callback: (result: Chat[]) => void)
export function findAfter(date: Date, postId: any, callback: (result: Chat[]) => void) {
    // Check parameters
    if (typeof postId == 'string')
        postId = new ObjectID(postId);
    // Set aggregation pipeline stages
    var stages = [
        {
            $match: { _id: postId }
        },
        {
            $project: { _id: 0, chats: 1 }
        },
        {
            $unwind: '$chats'
        },
        {
            $project: {
                date: '$chats.date',
                userId: '$chats.userId',
                msg: '$chats.msg'
            }
        },
        {
            $match: {
                date: {
                    $gt: date
                }
            }
        }
    ];
    // Aggregate
    post.aggregate(stages, (err, results: any[]) => {
        if (err) return console.error(err);
        callback(results);
    });
}


// Because of circular module dependency, import after export other functions
import index = require('./index');
// Get Post collection
index.getPostCollection((_post) => {
    post = _post;
});