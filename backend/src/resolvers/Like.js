const Like = {
    user(parent, args, { db }, info) {
        return db.collection('users').findOne(
            { "id": parent.user }
        );
    },
    post(parent, args, { db }, info) {
        return db.collection('posts').findOne(
            { "id": parent.post }
        );
    },
}

export { Like as default }
