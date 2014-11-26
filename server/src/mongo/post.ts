import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;

class post {
    _id: ObjectID;      // mongodb primary key
    name: string;       // name
    date: string        // created date
    member: ObjectID[]  // users
}