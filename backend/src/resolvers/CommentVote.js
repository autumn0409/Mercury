const CommentVote = {
    user(parent, args, { db }, info) {
        return db.collection('users').findOne(
            { "id": parent.user }
        );
    },
    comment(parent, args, { db }, info) {
        return db.collection('comments').findOne(
            { "id": parent.comment }
        );
    },
}

export { CommentVote as default }
