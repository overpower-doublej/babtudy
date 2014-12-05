import request = require('supertest');
import should = require('should');
import app = require('../../src/app');
import mongo = require('../../src/mongo/mongo');
import dbPost = require('../../src/mongo/post');
import colors = require('colors');

before((done) => {
    setTimeout(() => {
        mongo.getDb('bobtudy', (db) => {
            db.dropDatabase((err, result) => {
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

describe('Users join', () => {

    it('POST /user - user1', (done) => {
        request(app)
            .post('/user')
            .send(user1)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                done();
            });
    });

    it('POST /user - user2', (done) => {
        request(app)
            .post('/user')
            .send(user2)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                done();
            });
    });

    it('POST /user - user3', (done) => {
        request(app)
            .post('/user')
            .send(user3)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                done();
            });
    });

    it('POST /user - user4', (done) => {
        request(app)
            .post('/user')
            .send(user4)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                done();
            });
    });
});

describe('User1 login', () => {
    it('POST /user/:id/login', (done) => {
        request(app)
            .post('/user/' + user1._id + '/login')
            .send({ pwd: user1.pwd })
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                res.body.success.should.equal(1);
                done();
            });
    });
});

describe('User3 create BoBroom', () => {
    it('POST /post', (done) => {
        var reqBody = {
            title: 'User3의 밥룸!',
            date: new Date().toISOString(),
            menu: '돈부우우우리',
            place: '후우우우우문',
            content: '밥먹을사라아아아아암',
            boss: user3._id
        };

        request(app)
            .post('/post')
            .send(reqBody)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                res.body.success.should.equal(1);
                console.log('# New Post Info'.bold.cyan);
                console.log(res.body);
                done();
            });
    });
});

var newBobroom;

describe('Users search for bobrooms', () => {
    it('GET /post', (done) => {
        request(app)
            .get('/post')
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                res.body.success.should.equal(1);
                console.log('# BoBroom List'.bold.cyan);
                console.log(res.body);
                newBobroom = res.body.data[0];
                done();
            });
    });
});

describe('User1 wants to join User\'s BoBroom', () => {
    it('POST /post/:postId/acs', (done) => {
        request(app)
            .post('/post/' + newBobroom._id + '/acs')
            .send({ userId: user1._id })
            .end((err, res) => {
                should.not.exist(err);
                res.body.success.should.equal(1);   // because of invalid registration id
                done();
            });
    });
});

describe('User3 denies User1', () => {
    it('POST /post/:postId/acs/:acsId', (done) => {
        dbPost.findById(newBobroom._id, (err, result) => {
            request(app)
                .post('/post/' + newBobroom._id + '/acs/' + result.accesses[0]._id)
                .send({ userId: user3._id, vote: false })
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.success.should.equal(0);   // because of invalid registration id
                    done();
                });
        });
    });
});