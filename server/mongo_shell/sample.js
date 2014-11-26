use bobtudy

db.user.drop();
db.post.drop();
db.chat.drop();

function ran(num) {
    return Math.round(Math.random() * num);
}

var user0 = {
    name: '김태준',
    dept: '전전컴',
    stuId: '2012440037',
    info: '자기소개 입니당. 만나서 반갑습니당.',
    regId: 'registration_id'
};

var user1 = {
    name: '연은지',
    dept: '전전컴',
    stuId: '2012440083',
    info: '자기소개 입니당. 만나서 반갑습니당.',
    regId: 'registration_id'
};

var user2 = {
    name: '하나래',
    dept: '전전컴',
    stuId: '2012440089',
    info: '자기소개 입니당. 만나서 반갑습니당.',
    regId: 'registration_id'
};

var user3 = {
    name: '주소현',
    dept: '전전컴',
    stuId: '2012440067',
    info: '자기소개 입니당. 만나서 반갑습니당.',
    regId: 'registration_id'
};

var user4 = {
    name: '이경규',
    dept: '전전컴',
    stuId: '2012440058',
    info: '자기소개 입니당. 만나서 반갑습니당.',
    regId: 'registration_id'
};

var users = [];
users.push(user0, user1, user2, user3, user4);
users.forEach(function (user) {
    db.user.insert(user);
});

users = db.user.find().toArray();

var post1 = {
    title: '밥먹을 사람 구함!',
    date: new Date(),
    menu: '돈부리',
    place: '후문',
    content: '아싸끼리 밥먹어요 ㅎㅎ',
    users: [],
    codes: {},
    accesses: [],
    _postedDate: new Date()
};

// 3명이 밥터디 그룹에 들어있다고 가정
for (var i = 0; i < 3; i++) {
    var user = users[i];
    var userId = user._id.str;
    post1.users.push(userId);
    post1.codes[userId] = ran(10000).toString();
}

var access1 = {
    _id: new ObjectId(),
    userId: users[3]._id,
    votes: {}
};

access1.votes[users[2]._id.str] = true;
access1.votes[users[1]._id.str] = true;

post1.accesses.push(access1);

db.post.insert(post1);
post1 = db.post.findOne();

var chat1 = {
    _id: post1._id,
    msg: []
};

for (var i = 0; i < ran(100); i++) {
    var date = new Date();
    date.setHours(i);
    var msg = {
        _id: date,
        msg: 'message ' + i,
        userId: users[ran(3)]._id
    };
    chat1.msg.push(msg);
}

db.chat.insert(chat1);

db.user.find().pretty();
db.post.find().pretty();
db.chat.find().pretty();

chat1 = db.chat.findOne();
