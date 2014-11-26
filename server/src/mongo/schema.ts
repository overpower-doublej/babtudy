import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;

class Post {
    _id: ObjectID;          // 기본키
    title: string;          // 제목
    date: Date;             // 언제 먹을지
    menu: string;           // 메뉴
    place: string;          // 장소
    content: Text;          // 내용

    users: ObjectID[];      // 참가한 사용자들의 id
    codes: Code;            // 사용자들의 인증 번호
    accesses: Access[];     // 참가 신청 목록

    _postedDate: Date;      // private 밥터디 참가 모집글을 올린 시간
}

class Code {        // "userId": "4-digit key"
    user1: string;
    user2: string;
    user3: string;
    user4: string;
    userMore: string;
}

class Access {
    _id: ObjectID;          // 기본키
    userId: ObjectID;       // 참가 신청한 사용자 id
    votes: Vote;            // 밥터디 멤버들의 투표 결과
    result: boolean;        // 최종 투표결과. 찬성이면 true, 반대면 false 이다. 아직 투표가 끝나지 않았다면 undefined
}

class Vote {        // "userId": boolean
    user1: boolean;
    user2: boolean;
    user3: boolean;
    user4: boolean;
    userMore: boolean;
}

class User {
    _id: ObjectID;          // 기본키
    name: string;           // 사용자 이름
    dept: string;           // 학과
    stuId: string;          // 학번
    info: Text;             // 자기소개
}

class Chat {
    _id: ObjectID;          // 기본키 Post._id 참조
    msg: Message[];
}

class Message {
    _id: Date;              // Android에서 전송을 누른 시각
    msg: string;            // 메세지 내용
    userId: ObjectID;       // 사용자 id
}