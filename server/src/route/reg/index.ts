import express = require('express');
import send = require('../../gcm/send');

var router = express.Router();
router
    .post('/', (req, res, next) => {
        // registration id
        var regId = req.body['regId'];

        console.log('New registeration!');

        // Response for HTTP POST
        res.json({
            msg: 'Thanks for your registration!',
            date: new Date().toString()
        });
        // Setup message for GCM
        var msg = {
            msg: 'New Message!',
            date: new Date().toString()
        };
        // Send GCM
        send(regId, msg, (result) => {
            console.log('Google Cloud Message sended');
            console.log(msg);
            console.log(result);
        });
    });

export = router;
