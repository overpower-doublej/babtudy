import express = require('express');

var router = express.Router();
router
    .get('/', function (req, res, next) {
        res.json({
            msg: 'Hello Android!'
        });
    })
    .use('/user', require('./user/index'))
    .use('/post', require('./post/index'))
    .use('/reg', require('./reg/index'));

export = router;
