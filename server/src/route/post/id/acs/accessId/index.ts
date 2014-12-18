﻿/// <reference path="../../../../../../Scripts/typings/colors/colors.d.ts" />
import express = require('express');
import extend = require('extend');
import dbUser = require('../../../../../mongo/user');
import dbPost = require('../../../../../mongo/post/index');
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

        res.json({ success: 1, failure: 0, data: access });
    })
    .post('/', (req, res, next) => {
        var post: Post = req['post'];
        var access: Access = req['acs'];

        var userId = req.body['userId'];
        var vote = req.body['vote'];

        if (typeof vote != 'boolean') {
            if (vote == 'false')
                vote = false;
            else if (vote == 'true')
                vote = true;
        }
        // Update vote data
        dbPost.access.updateVote(post._id, access._id, userId, vote, (err, result) => {
            if (err)
                return res.json({ success: 0, failure: 1 });

            // Did everyone vote?
            dbPost.access.findById(post._id, access._id, (access) => {
                for (var userId in access.votes) {
                    var vote = access.votes[userId];
                    // If someone didn't vote yet, return
                    if (vote == null)
                        return res.json({ success: 1, failure: 0, msg: 'Vote did not finish yet' });
                }

                // Vote finished
                res.json({ success: 1, failure: 0, msg: 'Vote finished' });

                // Set vote result
                dbPost.access.setVoteResult(post._id, access._id, (voteResult) => {
                    // If vote finished, send GCM
                    dbUser.findRegIds([access.userId], (regIds) => {
                        var data = {
                            postId: post._id,
                            accessId: access._id,
                            result: voteResult
                        };
                        var gcmMsg = new gcm.GcmMsg(CODE.VOTE_FINISH, data);
                        gcm.send(regIds, gcmMsg);
                    });
                });
            });
        });
    });

export = router;
