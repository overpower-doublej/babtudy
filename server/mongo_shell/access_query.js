db.post.update({
    _id: post1._id,
    'accesses._id': post1.accesses[1]._id
}, {
    $set: {
        'accesses.$.votes': access2.votes,
        'accesses.$.result': access2.result
    }
});