const Query = {
  async users(parent, args, { db }, info) {
    if (!args.query) {
      return db.collection('users').find().toArray();
    }

    return db.collection('users').find(
      { "name": { $regex: new RegExp("^" + args.query.toLowerCase(), "i") } }
    ).toArray();
  },

  subs(parent, args, { db }, info) {
    if (!args.query) {
      return db.collection('subs').find().toArray();
    }

    return db.collection('subs').find(
      { "name": { $regex: new RegExp("^" + args.query.toLowerCase(), "i") } }
    ).toArray();
  },

  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.collection('posts').find().toArray();
    }

    return db.collection('posts').find(
      {
        $or: [
          { "title": { $regex: new RegExp(args.query.toLowerCase(), "i") } },
          { "body": { $regex: new RegExp(args.query.toLowerCase(), "i") } }
        ]
      }).toArray();
  },

  comments(parent, args, { db }, info) {
    return db.collection('comments').find().toArray();
  },

  likes(parent, args, { db }, info) {
    return db.collection('likes').find().toArray();
  },

  me() {
    return {
      id: '8fd7c19a-98ae-4d3a-aac1-d26b417a665e',
      name: 'Andrew',
      email: 'andrew@example.com'
    }
  },
}

export { Query as default }
