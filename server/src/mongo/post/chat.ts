/// <reference path="../../../Scripts/typings/mongodb/mongodb.d.ts" />
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import mongo = require('../mongo');
import config = require('../../config');
import schema = require('../schema');
import User = schema.User;
import Post = schema.Post;
import Access = schema.Access;


var post: mongodb.Collection;

export function doSomething() {

}

// Because of circular module dependency, import after export other functions
import index = require('./index');
// Get Post collection
index.getPostCollection((_post) => {
    post = _post;
});