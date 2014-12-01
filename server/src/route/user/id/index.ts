﻿import express = require('express');
import extend = require('extend');
import db = require('../../../mongo/user');
import schema = require('../../../mongo/schema');
import User = schema.User;

var router = express.Router();
router
    .get('/', (req, res, next) => {
        res.json(req.user);
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

    });

export = router;
