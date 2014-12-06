import express = require('express');
import extend = require('extend');
import db = require('../../mongo/user');
import schema = require('../../mongo/schema');
import User = schema.User;

var router = express.Router();
router

    .post('/', (req, res, next) => {
        var _id = req.body['_id'];
        var pwd = req.body['pwd'];
        var name = req.body['name'];
        var dept = req.body['dept'];
        var stuId = req.body['stuId'];
        var info = req.body['info'];
        var regId = req.body['regId'];

        var data = {
            _id: _id,
            name: name,
            pwd: pwd,
            dept: dept,
            stuId: stuId,
            info: info,
            regId: regId
        };

        var newUser = new User(data);

        db.insert(newUser, (result) => {
            res.json({ success: 1, failure: 0 });
        });
    })
// Parse parameter 'id', insert user data into req.user
    .param('id', (req, res, next, _id) => {
        db.findById(_id, (user) => {
            req.user = user;
            next();
        });
    })
    .use('/:id', require('./id/index'));

export = router;
