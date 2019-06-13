const User = {
  posts(parent, args, { db }, info) {
    return db.collection('posts').find(
      { "author": parent.id }
    ).toArray();
  },
  comments(parent, args, { db }, info) {
    return db.collection('comments').find(
      { "author": parent.id }
    ).toArray();
  }
}

export { User as default }
