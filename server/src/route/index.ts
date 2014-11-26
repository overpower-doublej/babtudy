import express = require('express');

var router = express.Router();
router
    .get('/', function (req, res, next) {
        res.json({
            msg: 'Hello Android!'
        });
    })
    .use('/reg', require('./reg/index'));

export = router;
