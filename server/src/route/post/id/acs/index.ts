﻿import express = require('express');
import extend = require('extend');
import dbUser = require('../../../../mongo/user');
import dbPost = require('../../../../mongo/post/index');
import schema = require('../../../../mongo/schema');
import Post = schema.Post;
import User = schema.User;
import Access = schema.Access;
import gcm = require('../../../../gcm/gcm');
import CODE = require('../../../../gcm/pushCode');

var router = express.Router();
router
    .get('/', (req, res, next) => {
        var post: Post = req['post'];

        dbPost.access.find(post._id, (err, accesses) => {
            if (err)
                return res.json({ success: 0, failure: 1 });

            res.json({
                success: 1,
                failure: 0,
                data: accesses
            });
        });
    })
    .post('/', (req, res, next) => {
        var post: Post = req['post'];

        var userId = req.body['userId'];

        // Create new Access object
        var newAccess = new Access(userId, post);
        // Insert into db
        dbPost.access.push(post._id, newAccess, (err, result) => {
            if (err)
                res.json({ success: 0, failure: 1 });
            else
                res.json({
                    success: 1,
                    failure: 0,
                    data: {
                        accessId: newAccess._id
                    }
                });
        });

        // Find registration id of members of bobroom
        dbUser.findRegIds(post.users, (regIds) => {
            // Create GCM message
            var data = {
                userId: userId,
                accessId: newAccess._id,
                postId: post._id
            };
            var gcmMsg = new gcm.GcmMsg(CODE.ACCESS_JOIN, data);
            // Send GCM
            gcm.send(regIds, gcmMsg);
        });
    })
    .param('acsId', (req, res, next, acsId: string) => {
        var post: Post = req['post'];
        dbPost.access.findById(post._id, acsId, (access) => {
            req['acs'] = access;
            next();
        });
    })
    .use('/:acsId', require('./accessId/index'));

export = router;
