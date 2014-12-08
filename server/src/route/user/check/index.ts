/// <reference path="../../../../Scripts/typings/express-4.x/express.d.ts" />
import express = require('express');
import db = require('../../../mongo/user');
import schema = require('../../../mongo/schema');
import User = schema.User;

var router = express.Router();
router
    .get('/:id', (req, res, next) => {
        var userId = req.params['id'];

        db.findById(userId, (err, user) => {
            if (err)
                return res.json({ success: 0, failure: 1 });

            if (user == null)
                res.json({ success: 1, failure: 0, data: { exists: 0 } });
            else
                res.json({ success: 1, failure: 0, data: { exists: 1 } });
        });
    });

export = router;
