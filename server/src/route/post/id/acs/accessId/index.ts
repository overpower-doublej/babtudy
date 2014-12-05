/// <reference path="../../../../../../Scripts/typings/colors/colors.d.ts" />
import express = require('express');
import extend = require('extend');
import dbUser = require('../../../../../mongo/user');
import dbPost = require('../../../../../mongo/post');
import schema = require('../../../../../mongo/schema');
import Post = schema.Post;
import User = schema.User;
import Access = schema.Access;
import gcm = require('../../../../../gcm/gcm');
import CODE = require('../../../../../gcm/pushCode');
//require('colors');

var router = express.Router();
router
    .get('/', (req, res, next) => {
        var post: Post = req['post'];
        var access: Access = req['acs'];

        res.json(access);
    })
    .post('/', (req, res, next) => {
        // Update vote
        var post: Post = req['post'];
        var access: Access = req['acs'];

        var userId = req.body['userId'];
        var vote = req.body['vote'];

        console.log(post);
        console.log(access);

        // Update vote data
        dbPost.updateVote(post._id, access._id, userId, vote, (result) => {
            if (result)
                res.json({ success: 1, failure: 0 });
            else
                res.json({ success: 0, failure: 1 });

            // Did everyone vote?
            dbPost.findAccess(post._id, access._id, (access) => {
                for (var userId in access.votes) {
                    var vote = access.votes[userId];
                    // If someone didn't vote yet, return
                    if (vote == null)
                        return;
                }
                console.log('everyone finished vote!!'.green);
                dbUser.findRegIds(post.users, (regIds) => {
                    gcm.se
                });
            });
        });
    });

export = router;
