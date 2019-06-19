const Sub = {
    posts(parent, args, { db }, info) {
        return db.collection('posts').find(
            { "sub": parent.id }
        ).toArray();
    },
}

export { Sub as default }
