/// <reference path="../../Scripts/typings/extend/extend.d.ts" />
import extend = require('extend');
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;

export class Post {
    _id: ObjectID;          // 기본키
    title: string;          // 제목
    date: Date;             // 언제 먹을지
    postedDate: Date;       // 글을 올린 시간
    menu: string;           // 메뉴
    place: string;          // 장소
    content: Text;          // 내용
    boss: string;           // 방장

    users: string[];        // 참가한 사용자들의 id
    accesses: Access[];     // 참가 신청 목록
    chat: Message[];        // 채팅
    attend: Object;         // 출석 {userId: boolean}

    /**
     * If '_id' is specified, this Post object is created by existing document.
     * Else, this object is used when insert new document into Post collection.
     */
    constructor(data: any, _id?: string) {
        // Create new Post
        if (_id == undefined) {
            delete data._id;
            extend(this, data);

            this.postedDate = new Date();
            this.users = [];
            this.accesses = [];
            this.chat = [];
            this.attend = {};

            this.users.push(this.boss);
        }
        // From existing document
        else {
            extend(this, data);
        }
    }
}

export class Access {
    _id: ObjectID;          // 기본키
    userId: string;       // 참가 신청한 사용자 id
    votes: Object;          // 밥터디 멤버들의 투표 결과 {userId: boolean}
    date: Date;             // 신청 날짜
    result: boolean;        // 최종 투표결과. 찬성이면 true, 반대면 false 이다. 아직 투표가 끝나지 않았다면 undefined

    constructor(userId: string, post: Post) {
        this._id = new ObjectID();
        this.userId = userId;
        this.votes = {};
        this.date = new Date();

        post.users.forEach((user) => {
            this.votes[user] = null;
        });

        delete this.result;
    }
}

export class User {
    _id: string;            // 기본키, 사용자가 회원가입할때 입력한 ID
    pwd: string;            // 비밀번호
    name: string;           // 사용자 이름
    dept: string;           // 학과
    stuId: string;          // 학번
    info: Text;             // 자기소개
    regId: string[];        // registration_id for GCM
    meetLog: number[];      // [나온횟수, 총만나기로한횟수] ex)사용자가 10번중 7번 나왔으면 [7, 10]

    constructor(data?: Object) {
        if (typeof data != 'object')
            data = {};

        extend(this, data);
    }
}

export class Message {
    date: Date;              // Android에서 전송을 누른 시각
    msg: string;            // 메세지 내용
    userId: string;       // 사용자 id
}