import express = require('express');
import extend = require('extend');
import dbUser = require('../../../mongo/user');
import dbPost = require('../../../mongo/post/index');
import schema = require('../../../mongo/schema');
import Post = schema.Post;
import User = schema.User;
import Access = schema.Access;
import gcm = require('../../../gcm/gcm');
import CODE = require('../../../gcm/pushCode');

var router = express.Router();
router
    .get('/', (req, res, next) => {
        var post: Post = req['post'];
        res.json({ success: 1, failure: 0, data: post });
    })
    .use('/acs', require('./acs/index'))
    .use('/chat', require('./chat/index'));

export = router;
