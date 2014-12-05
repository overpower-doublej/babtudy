import express = require('express');
import extend = require('extend');
import db = require('../../../mongo/user');
import schema = require('../../../mongo/schema');
import User = schema.User;
import Access = schema.Access;

var router = express.Router();
router
    .post('/acs', (req, res, next) => {
        var post = req['post'];
        console.log(post);
        var userId = req.body.userId;

        var newAcs = new Access(userId, post);
        res.json(newAcs);
    });

export = router;
