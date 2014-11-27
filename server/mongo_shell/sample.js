use bobtudy

// Drop database
db.dropDatabase();

// Random function
function ran(num) {
    return Math.round(Math.random() * num);
}

// Insert users
var users = [];

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

var user5 = {
    name: '권혁윤',
    dept: '법도수호자',
    stuId: '???',
    info: '자기소개 입니당. 만나서 반갑습니당.',
    regId: 'registration_id'
}

users.push(user0, user1, user2, user3, user4, user5);

users.forEach(function (user) {
    db.user.insert(user);
});

users = db.user.find().toArray();

// Insert post
var post1 = {
    title: '밥먹을 사람 구함!',
    date: new Date(),
    menu: '돈부리',
    place: '후문',
    content: '밥먹자!!!',
    users: [],
    codes: {},
    accesses: [],
    chat: [],
    _postedDate: new Date()
};

// 3명이 밥터디 그룹에 들어있다고 가정
for (var i = 0; i < 3; i++) {
    var user = users[i];
    var userIdStr = user._id.str;
    post1.users.push(user._id);
    post1.codes[userIdStr] = ran(10000).toString();
}

// accesses
var access1 = {
    _id: new Date(),
    userId: users[4]._id,
    votes: {},
    result: undefined
};

access1.votes[users[0]._id.str] = true;
access1.votes[users[2]._id.str] = false;

access1.result = false;

post1.accesses.push(access1);

var access2 = {
    _id: new Date(),
    userId: users[3]._id,
    votes: {}
};

access2.votes[users[0]._id.str] = true;
access2.votes[users[1]._id.str] = true;
access2.votes[users[2]._id.str] = true;

access2.result = true;

post1.accesses.push(access2);

var access3 = {
    _id: new Date(),
    userId: users[5]._id,
    votes: {}
};

access3.votes[users[0]._id.str] = true;

post1.accesses.push(access3);

// chat
for (var i = 0; i < ran(100); i++) {
    var date = new Date();
    date.setHours(i);
    var msg = {
        date: date,
        msg: 'message ' + i,
        userId: users[ran(3)]._id
    };
    post1.chat.push(msg);
}


db.post.insert(post1);
db.post.findOne();


