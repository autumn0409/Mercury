const Post = {
  author(parent, args, { db }, info) {
    return db.collection('users').findOne(
      { "id": parent.author }
    );
  },
  comments(parent, args, { db }, info) {
    return db.collection('comments').find(
      { "post": parent.id }
    ).toArray();
  },
  likes(parent, args, { db }, info) {
    return db.collection('likes').find(
      { "post": parent.id }
    ).toArray();
  }
}

export { Post as default }
