import express = require('express');
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
    .get('/after/:date', (req, res, next) => {
        var post: Post = req['post'];

        var ISOstring = req.params['date'];
        var date = new Date(ISOstring);

        dbPost.chat.findAfter(date, post._id, (result) => {
            res.json({ success: 1, failure: 0, data: result });
        });
    })
    .post('/', (req, res, next) => {
        var post: Post = req['post'];

        var userId = req.body['userId'];
        var msg = req.body['msg'];

        // Insert doc into db
        dbPost.chat.push(post._id, userId, msg, (result) => {
            res.json({ success: 1, failure: 0 });

            // Send GCM to users in bobroom
            dbUser.findRegIds(post.users, (regIds) => {
                var data = {
                    postId: post._id
                };
                var gcmMsg = new gcm.GcmMsg(CODE.NEW_CHAT, data);

                gcm.send(regIds, gcmMsg);
            });
        });
    });

export = router;
