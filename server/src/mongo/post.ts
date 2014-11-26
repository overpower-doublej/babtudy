import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;

class Post {
    _id: ObjectID;      // mongodb primary key
    title: string;       // 제목
    date: Date;          // 언제 먹을지
    menu: string;       // 메뉴
    place: string;      // 장소
    content: Text;

    users: User[];  // users
    codes: Code;
    accesses: Access[];

    _postDate: Date;
}

class Code {
    user1: string;
    user2: string;
    user3: string;
    user4: string;
    userMore: string;
}

class Access {
    _id: ObjectID;
    userId: ObjectID;               // refernces User._id
    votes: Vote;
    result: boolean;                // If accepted true, else if declined false, else if vote did not finish yet, undefined
}

class Vote {
    user1: boolean;
    user2: boolean;
    user3: boolean;
    user4: boolean;
    userMore: boolean;
}

class User {
    _id: ObjectID;
    name: string;
    dept: string;
    stuId: string;
    info: Text;
}

class Chat {
    _id: ObjectID;
    postId: ObjectID;
    msg: Message[];
}

class Message {
    _id: Date;
    msg: string;
    userId: ObjectID;
}