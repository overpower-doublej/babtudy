process.env.MODE = 'test';

var request = require('supertest');
var should = require('should');
var app = require('../../src/app');

before(function (done) {
});

describe('chat', function () {
    it('user3 talks', function (done) {
        var data = {
            userId: user3._id,
            msg: '안녕하세요 ㅎㅎ'
        };

        request(app).post('/post/' + newBobroom._id + '/chat').send(data).expect(200).end(function (err, res) {
            should.not.exist(err);
            res.body.success.should.equal(1); // because of invalid registration id
            done();
        });
    });

    it('other people can read', function (done) {
        //done();
    });
});
//# sourceMappingURL=chat.test.js.map
