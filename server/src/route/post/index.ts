import express = require('express');
import db = require('../../mongo/post');
import schema = require('../../mongo/schema');
import Post = schema.Post;

var router = express.Router();
router
    .get('/', (req, res, next) => {

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

        // Insert into mongodb
        db.insert(newPost, (result) => {
            res.json(result);
        });
    });

export = router;
