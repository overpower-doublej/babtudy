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
                /**
                 * ########################## DELETE HERE
                 */
                result.failure = 0;
                result.success = 1;

                if (result.failure)
                    res.json({
                        success: 0,
                        failure: 1,
                        msg: 'GCM fail'
                    });
                else if (result.success) {
                    // Create new Access object
                    var newAccess = new Access(userId, post);
                    // Insert into db
                    dbPost.access.push(post._id, newAccess, (result) => {
                        res.json({
                            success: 1,
                            failure: 0,
                            data: {
                                accessId: newAccess._id
                            }
                        });
                    });
                }
                else
                    res.json({
                        success: 0,
                        failure: 1
                    });
            });
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
