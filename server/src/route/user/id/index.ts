/// <reference path="../../../../Scripts/typings/express-4.x/express.d.ts" />
import express = require('express');
import db = require('../../../mongo/user');
import schema = require('../../../mongo/schema');
import User = schema.User;

var router = express.Router();
router
    .get('/', (req, res, next) => {
        var user = {
            _id: req.user._id,
            name: req.user.name
        };
        res.json(user);
    })
    .post('/', (req, res, next) => {
        var oldUser = req.user;

        var _id = oldUser._id;
        var name = req.body['name'];
        var pwd = req.body['pwd'];
        var dept = req.body['dept'];
        var stuId = req.body['stuId'];
        var info = req.body['info'];
        //var regId = req.body['regId'];    // Cannot change easily

        var updatedUser = {
            _id: _id,
            name: name,
            pwd: pwd,
            dept: dept,
            stuId: stuId,
            info: info
        };

        db.update(new User(updatedUser), (result) => {
            res.json(result);
        });
    })
    .post('/login', (req, res, next) => {
        var user: User = req.user;
        console.log(req.body);
        var pwd = req.body['pwd'];

        db.findById(user._id, (user) => {
            if (user.pwd == pwd)
                res.json({ success: 1, failure: 0 });
            else if (user.pwd != pwd)
                res.json({ success: 0, failure: 1, msg: 'Incorrect password' });
            else
                res.json({ success: 0, failure: 1, msg: 'User ID does not exist' });
        });
    });

export = router;
