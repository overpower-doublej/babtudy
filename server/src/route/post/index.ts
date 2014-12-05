/// <reference path="../../../Scripts/typings/express-4.x/express.d.ts" />
import express = require('express');
import db = require('../../mongo/post');
import schema = require('../../mongo/schema');
import Post = schema.Post;

var router = express.Router();
router
    .get('/', (req, res, next) => {
        db.fetch((results) => {
            res.json(results);
        });
    })
    .post('/', (req, res, next) => {
        var b = req.body;

        var title = b.title;
        var date = b.date;
        var menu = b.menu;
        var place = b.place;
        var content = b.content;
        var boss = b.boss;

        var data = {
            title: title,
            date: date,
            menu: menu,
            place: place,
            content: content,
            boss: boss
        };

        var newPost = new Post(data);
        console.log(newPost);
        // Insert into mongodb
        db.insert(newPost, (err, result) => {
            console.log(result);
            if (err)
                res.json({ msg: 'error' });
            else
                res.json(result);
        });
    })
    .param('id', (req, res, next, _id) => {
        db.findById(_id, (err, post) => {
            req['post'] = post;
            console.log(post);
            next();
        });
    })
    .use('/:id', require('./id/index'));

export = router;
