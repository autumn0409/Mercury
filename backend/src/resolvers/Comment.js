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
  commentVotes(parent, args, { db }, info) {
    return db.collection('commentvotes').find(
      { "comment": parent.id }
    ).toArray();
  }
}

export { Comment as default }
