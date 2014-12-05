﻿import express = require('express');
import extend = require('extend');
import dbUser = require('../../../../mongo/user');
import dbPost = require('../../../../mongo/post');
import schema = require('../../../../mongo/schema');
import Post = schema.Post;
import User = schema.User;
import Access = schema.Access;
import gcm = require('../../../../gcm/gcm');
import CODE = require('../../../../gcm/pushCode');

var router = express.Router();
router
    .post('/', (req, res, next) => {
        /**
         * New access. One user wants to join bobroom.
         * Send votes to users members of bobroom through GCM.
         * And then if GCM is success, create access and response.
         */

        var post: Post = req['post'];
        var userId = req.body.userId;

        // Find registration id of members of bobroom
        dbUser.findRegIds(post.users, (regIds) => {
            // Create GCM message
            var gcmMsg = new gcm.GcmMsg(CODE.ACCESS_JOIN, { userId: userId });
            // Send GCM
            gcm.send(regIds, gcmMsg, (result) => {
                if (result.failure)
                    res.json({
                        code: CODE.ACCESS_JOIN,
                        success: 0,
                        failure: 1,
                        data: {}
                    });
                else if (result.success) {
                    // Create new Access object
                    var newAcs = new Access(userId, post);
                    // Insert into db
                    dbPost.pushAccess(post._id, newAcs, (result) => {
                        res.json({
                            success: 1,
                            failure: 0
                        });
                    });
                }
            });
        });
    })
    .param('acsId', (req, res, next, acsId: string) => {
        var post: Post = req['post'];
        dbPost.findAccess(post._id, acsId, (access) => {
            console.log(access);
            req['acs'] = access;
            next();
        });
    })
    .use('/:acsId', require('./accessId/index'));

export = router;
