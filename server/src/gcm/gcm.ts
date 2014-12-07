/// <reference path="../../Scripts/typings/node/node.d.ts" />
/// <reference path="../../Scripts/typings/colors/colors.d.ts" />
import db = require('../mongo/gcm');
var gcm = require('node-gcm');
import configAll = require('../config');
var config = configAll.gcm;

export class GcmMsg {
    CODE: number;
    data: any;

    constructor(CODE: number, data: any) {
        this.CODE = CODE;
        this.data = data;
    }
}

export interface IGCMSendReturnMsg {
    multicast_id: number;
    success: number;
    failure: number;
    canonical_ids: number;
    results: Object[];
}

export function send(regIds: string[], msg: GcmMsg, callback?: (result: IGCMSendReturnMsg) => void) {
    // Check params
    if (typeof callback != 'function')
        callback = () => { };

    // Create a message
    var gcmMsg = new gcm.Message({
        collapseKey: Math.round(Math.random() * 10).toString(),     // Must be string
        //delayWhileIdle: true,
        //timeToLive: 3,
        data: msg
    });

    // Setup sender
    var sender = new gcm.Sender(config.SERVER_ACCESS_KEY);

    /**
     * Params: message-literal, registrationIds-array, No. of retries, callback-function
     **/
    sender.send(gcmMsg, regIds, config.NumOfSendRetry, function (err, result: IGCMSendReturnMsg) {
        if (err) return console.error(err);

        if (result.failure) {
            console.log('GCM failure'.red);
            console.log(result);
        }

        callback(result);
        db.insert(regIds, msg, result);
    });
}
