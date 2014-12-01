use bobtudy;

    // Random function
function ran(num) {
    return Math.round(Math.random() * num);
}

db.dateTest.drop();

for(var i = 0; i < ran(100); i++){
    var date = new Date();
    date.setHours(ran(24 * 7));

    db.dateTest.insert({date: date});
}

var date = new Date();
db.dateTest.find({date: {$gt: new Date()}}).sort({date: 1}).pretty();
