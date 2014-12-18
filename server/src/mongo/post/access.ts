/// <reference path="../../../Scripts/typings/mongodb/mongodb.d.ts" />
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import mongo = require('../mongo');
import config = require('../../config');
import schema = require('../schema');
import User = schema.User;
import Post = schema.Post;
import Access = schema.Access;


var post: mongodb.Collection;

export function push(postId: ObjectID, access: Access, callback: (err, result) => void) {
    post.update({ _id: postId }, { $push: { accesses: access } }, (err, result) => {
        callback(err, result);
    });
}

export function find(postId: string, callback: (err, accesses: Access[]) => void);
export function find(postId: ObjectID, callback: (err, accesses: Access[]) => void);
export function find(postId: any, callback: (err, access: Access[]) => void) {
    // Check argument
    if (typeof postId == 'string')
        postId = new ObjectID(postId);
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
            $project: {
                _id: '$accesses._id',
                userId: '$accesses.userId',
                votes: '$accesses.votes',
                date: '$accesses.date',
                result: '$accesses.result'
            }
        }
    ];
    // Aggregate
    post.aggregate(stages, (err, results: Access[]) => {
        if (err) return console.error(err);
        callback(err, results);
    });
}

export function findById(postId: string, accessId: string, callback: (access: Access) => void);
export function findById(postId: string, accessId: ObjectID, callback: (access: Access) => void);
export function findById(postId: ObjectID, accessId: string, callback: (access: Access) => void);
export function findById(postId: ObjectID, accessId: ObjectID, callback: (access: Access) => void);
export function findById(postId: any, accessId: any, callback: (access: Access) => void) {
    // Check argument
    if (typeof postId == 'string')
        postId = new ObjectID(postId);
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
        },
        {
            $project: {
                _id: '$accesses._id',
                userId: '$accesses.userId',
                votes: '$accesses.votes',
                date: '$accesses.date',
                result: '$accesses.result'
            }
        }
    ];
    // Aggregate
    post.aggregate(stages, (err, results: Access[]) => {
        if (err) return console.error(err);
        callback(results[0]);
    });
}


export function updateVote(postId: ObjectID, accessId: ObjectID, userId: string, vote: boolean, callback: (err, result) => void) {
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
        callback(err, result);
    });
}

export function setVoteResult(postId: ObjectID, accessId: ObjectID, callback?: (voteResult) => void) {
    // Check arguments
    if (typeof callback != 'function')
        callback = () => { };

    // Set query
    var selector = {
        _id: postId,
        'accesses._id': accessId
    };

    var voteResult = true;

    findById(postId, accessId, (access) => {
        var votes = access.votes;

        for (var userId in access.votes) {
            if (votes[userId] == false) {
                voteResult = false;
                break;
            }
        }
        // Set replacement document
        var doc = { $set: { 'accesses.$.result': voteResult } };

        // Update
        post.update(selector, doc, { w: 1 }, (err, result) => {
            if (err) return console.error(err);
            // If vote result is true, push user into BoBroom member, and call callback function.
            if (voteResult == true) {
                post.update({ _id: postId }, { $push: { users: access.userId } }, { w: 1 }, (err, result1) => {
                    if (err) return console.error(err);
                    callback(voteResult);
                });
            }
            // Else if vote result is false, just call callback function immediately.
            else if (voteResult == false)
                callback(voteResult);
        });


    });
}

// Because of circular module dependency, import after export other functions
import index = require('./index');
// Get Post collection
index.getPostCollection((_post) => {
    post = _post;
});

