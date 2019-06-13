const Comment = {
  author(parent, args, { db }, info) {
    return db.collection('users').findOne(
      { "id": parent.author }
    );
  },
  post(parent, args, { db }, info) {
    return db.collection('posts').findOne(
      { "id": parent.post }
    );
  },
}

export { Comment as default }
