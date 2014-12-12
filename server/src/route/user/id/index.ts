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
            name: req.user.name,
            meetLog: req.user.meetLog
        };
        res.json({ success: 1, failure: 0, data: user });
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
            res.json({ success: 1, failure: 0 });
        });
    })

    .post('/login', (req, res, next) => {
        var user: User = req['user'];

        var pwd = req.body['pwd'];

        db.findById(user._id, (err, user) => {
            if (err)
                return res.json({ success: 0, failure: 1 });

            if (user.pwd == pwd)
                res.json({ success: 1, failure: 0, data: { correct: 1 } });
            else if (user.pwd != pwd)
                res.json({ success: 1, failure: 0, data: { correct: 0 } });
            else
                res.json({ success: 0, failure: 1, msg: 'User ID does not exist' });
        });
    });

export = router;
