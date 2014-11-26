var gcm = require('node-gcm');
import configAll = require('../config');
var config = configAll.gcm;

function send(regId: string, msg: Object, callback: (result) => void) {
    // Create a message
    var gcmMsg = new gcm.Message({
        collapseKey: Math.round(Math.random() * 10).toString(),     // Must be string
        //delayWhileIdle: true,
        //timeToLive: 3,
        data: msg
    });
    // Setup sender
    var sender = new gcm.Sender(config.SERVER_ACCESS_KEY);
    // Setup target device's registration id as array form
    var regIds = [regId];
    /**
     * Params: message-literal, registrationIds-array, No. of retries, callback-function
     **/
    sender.send(gcmMsg, regIds, 4, function (err, result) {
        if (err) return console.error(err);
        callback(result);
    });

}

export = send;