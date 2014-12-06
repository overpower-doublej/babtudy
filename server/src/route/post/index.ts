/// <reference path="../../../Scripts/typings/express-4.x/express.d.ts" />
import express = require('express');
import db = require('../../mongo/post/index');
import schema = require('../../mongo/schema');
import Post = schema.Post;

var router = express.Router();
router
    .get('/', (req, res, next) => {
        db.find((err, results) => {
            if (err)
                res.json({ success: 0, failure: 1, msg: 'Internal server failure' });
            else
                res.json({ success: 1, failure: 0, data: results });
        });
    })
    .post('/', (req, res, next) => {
        var b = req.body;

        var title = b['title'];
        var date = b['date'];
        var menu = b['menu'];
        var place = b['place'];
        var content = b['content'];
        var boss = b['boss'];

        var data = {
            title: title,
            date: new Date(date),
            menu: menu,
            place: place,
            content: content,
            boss: boss
        };

        var newPost = new Post(data);

        // Insert into mongodb
        db.insert(newPost, (err, result) => {
            if (err)
                res.json({ success: 0, failure: 1, msg: 'Internal server fail' });
            else
                res.json({ success: 1, failure: 0, data: result });
        });
    })
    .param('id', (req, res, next, _id) => {
        db.findById(_id, (err, post) => {
            /**
             * Pass post object to next route handler.
             * Usage: req['post']
             */
            req['post'] = post;
            next();
        });
    })
    .use('/:id', require('./id/index'));

export = router;
