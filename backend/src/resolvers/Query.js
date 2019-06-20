import getUserId from '../utils/getUserId';

const Query = {
  users: async (parent, args, { db }, info) => {
    if (!args.query) {
      return db.collection('users').find().toArray();
    }

    return db.collection('users').find(
      { username: { $regex: new RegExp("^" + args.query.toLowerCase(), "i") } }
    ).toArray();
  },

  subs: (parent, args, { db }, info) => {
    if (!args.query) {
      return db.collection('subs').find().toArray();
    }

    return db.collection('subs').find(
      { name: { $regex: new RegExp("^" + args.query.toLowerCase(), "i") } }
    ).toArray();
  },

  posts: (parent, args, { db }, info) => {
    if (!args.query) {
      return db.collection('posts').find().toArray();
    }

    return db.collection('posts').find(
      {
        $or: [
          { title: { $regex: new RegExp(args.query.toLowerCase(), "i") } },
          { body: { $regex: new RegExp(args.query.toLowerCase(), "i") } }
        ]
      }).toArray();
  },

  comments: (parent, args, { db }, info) => {
    return db.collection('comments').find().toArray();
  },

  likes: (parent, args, { db }, info) => {
    return db.collection('likes').find().toArray();
  },

  me: async (parent, args, { request }) => {
    const id = getUserId(request)

    const me = await User.findById(id)

    if (!me) throw new Error('Unknown token.')

    return me
  },
}

export { Query as default }
