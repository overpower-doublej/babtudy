process.env.MODE = 'test';

var request = require('supertest');
var should = require('should');
var app = require('../../src/app');
var mongo = require('../../src/mongo/mongo');
var dbPost = require('../../src/mongo/post');

before(function (done) {
    setTimeout(function () {
        mongo.getDb('bobtudy', function (db) {
            db.dropDatabase(function (err, result) {
                done();
            });
        });
    }, 100);
});

var user1 = {
    _id: 'user1',
    pwd: 'user1234',
    name: 'Mr.User1',
    dept: 'department',
    stuId: '2012440037',
    info: '자기소개입니당',
    regId: 'registration_id_for_user1'
};

var user2 = {
    _id: 'user2',
    pwd: 'user2345',
    name: 'Mr.User2',
    dept: 'department',
    stuId: '2012440038',
    info: '자기소개입니당',
    regId: 'registration_id_for_user2'
};

var user3 = {
    _id: 'user3',
    pwd: 'user3456',
    name: 'Mr.User3',
    dept: 'department',
    stuId: '2012440039',
    info: '자기소개입니당',
    regId: 'registration_id_for_user3'
};

var user4 = {
    _id: 'user4',
    pwd: 'user4567',
    name: 'Mr.User4',
    dept: 'department',
    stuId: '2012440040',
    info: '자기소개입니당',
    regId: 'registration_id_for_user4'
};

describe('Users join', function () {
    it('POST /user - user1', function (done) {
        request(app).post('/user').send(user1).expect(200).end(function (err, res) {
            should.not.exist(err);
            done();
        });
    });

    it('POST /user - user2', function (done) {
        request(app).post('/user').send(user2).expect(200).end(function (err, res) {
            should.not.exist(err);
            done();
        });
    });

    it('POST /user - user3', function (done) {
        request(app).post('/user').send(user3).expect(200).end(function (err, res) {
            should.not.exist(err);
            done();
        });
    });

    it('POST /user - user4', function (done) {
        request(app).post('/user').send(user4).expect(200).end(function (err, res) {
            should.not.exist(err);
            done();
        });
    });
});

describe('User1 login', function () {
    it('POST /user/:id/login', function (done) {
        request(app).post('/user/' + user1._id + '/login').send({ pwd: user1.pwd }).expect(200).end(function (err, res) {
            should.not.exist(err);
            res.body.success.should.equal(1);
            done();
        });
    });
});

describe('User3 create BoBroom', function () {
    it('POST /post', function (done) {
        var reqBody = {
            title: 'User3의 밥룸!',
            date: new Date().toISOString(),
            menu: '돈부우우우리',
            place: '후우우우우문',
            content: '밥먹을사라아아아아암',
            boss: user3._id
        };

        request(app).post('/post').send(reqBody).expect(200).end(function (err, res) {
            should.not.exist(err);
            res.body.success.should.equal(1);

            //console.log('# New Post Info'.bold.cyan);
            //console.log(res.body);
            done();
        });
    });
});

var newBobroom;

describe('Users search for bobrooms', function () {
    it('GET /post', function (done) {
        request(app).get('/post').expect(200).end(function (err, res) {
            should.not.exist(err);
            res.body.success.should.equal(1);

            //console.log('# BoBroom List'.bold.cyan);
            //console.log(res.body);
            newBobroom = res.body.data[0];
            done();
        });
    });
});

describe('User1 wants to join User3\'s BoBroom', function () {
    it('POST /post/:postId/acs', function (done) {
        request(app).post('/post/' + newBobroom._id + '/acs').send({ userId: user1._id }).end(function (err, res) {
            should.not.exist(err);
            res.body.success.should.equal(1); // because of invalid registration id
            done();
        });
    });
});

describe('User3 denies User1', function () {
    it('POST /post/:postId/acs/:acsId', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            request(app).post('/post/' + newBobroom._id + '/acs/' + result.accesses[0]._id).send({ userId: user3._id, vote: false }).end(function (err, res) {
                should.not.exist(err);
                res.body.success.should.equal(0); // because of invalid registration id
                done();
            });
        });
    });

    it('must have result "false"', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            request(app).get('/post/' + newBobroom._id + '/acs/' + result.accesses[0]._id).end(function (err, res) {
                should.not.exist(err);
                res.body.success.should.equal(1); // because of invalid registration id
                res.body.data.result.should.equal(false);
                done();
            });
        });
    });

    it('must not push user1 into member of bobroom', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            result.users.should.not.containEql(user1._id);
            done();
        });
    });
});

var user2AccessId;
describe('User2 wants to join User3\'s BoBroom', function () {
    it('POST /post/:postId/acs', function (done) {
        request(app).post('/post/' + newBobroom._id + '/acs').send({ userId: user2._id }).end(function (err, res) {
            should.not.exist(err);
            res.body.success.should.equal(1); // because of invalid registration id
            res.body.data.should.have.property('accessId');
            user2AccessId = res.body.data.accessId;
            done();
        });
    });
});

describe('User3 accepts User2', function () {
    it('POST /post/:postId/acs/:acsId', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            request(app).post('/post/' + newBobroom._id + '/acs/' + user2AccessId).send({ userId: user3._id, vote: true }).end(function (err, res) {
                should.not.exist(err);
                res.body.success.should.equal(0); // because of invalid registration id
                done();
            });
        });
    });

    it('must have result "true"', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            request(app).get('/post/' + newBobroom._id + '/acs/' + user2AccessId).end(function (err, res) {
                should.not.exist(err);
                res.body.success.should.equal(1); // because of invalid registration id
                res.body.data.result.should.equal(true);
                done();
            });
        });
    });

    it('must push user2 into member of bobroom', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            result.users.should.containEql(user2._id);
            done();
        });
    });
});

var user4AccessId;
describe('user4 wants to join bobroom which is comprised of user3, and user2', function () {
    it('POST /post/:postId/acs', function (done) {
        request(app).post('/post/' + newBobroom._id + '/acs').send({ userId: user4._id }).end(function (err, res) {
            should.not.exist(err);
            res.body.success.should.equal(1); // because of invalid registration id
            res.body.data.should.have.property('accessId');
            user4AccessId = res.body.data.accessId;
            done();
        });
    });
});

describe('user3 and user2 accepts User4', function () {
    it('POST /post/:postId/acs/:acsId', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            request(app).post('/post/' + newBobroom._id + '/acs/' + user4AccessId).send({ userId: user3._id, vote: true }).end(function (err, res) {
                should.not.exist(err);
                res.body.success.should.equal(1); // because vote does not finish yet
                done();
            });
        });
    });

    it('POST /post/:postId/acs/:acsId', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            request(app).post('/post/' + newBobroom._id + '/acs/' + user4AccessId).send({ userId: user2._id, vote: true }).end(function (err, res) {
                should.not.exist(err);
                res.body.success.should.equal(0); // because of invalid registration id
                done();
            });
        });
    });

    it('must have result "true"', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            request(app).get('/post/' + newBobroom._id + '/acs/' + user4AccessId).end(function (err, res) {
                should.not.exist(err);
                res.body.success.should.equal(1); // because of invalid registration id
                res.body.data.result.should.equal(true);
                done();
            });
        });
    });

    it('must push user4 into member of bobroom', function (done) {
        dbPost.findById(newBobroom._id, function (err, result) {
            result.users.should.containEql(user4._id);
            done();
        });
    });
});
//# sourceMappingURL=scenario.test.js.map
