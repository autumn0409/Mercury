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

  favoritePosts: async (parent, args, { db, request }) => {
    const userId = getUserId(request);
    const user = await db.collection('users').findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    let myLikes = await db.collection('likes').find({ user: user.id });
    myLikes = await myLikes.toArray();

    const myFavoritePosts = myLikes.map(like => {
      return db.collection('posts').findOne({ id: like.post });
    })

    return myFavoritePosts;
  },

  comments: (parent, args, { db }, info) => {
    return db.collection('comments').find().toArray();
  },

  likes: (parent, args, { db }, info) => {
    return db.collection('likes').find().toArray();
  },

  me: async (parent, args, { db, request }) => {
    const id = getUserId(request);

    const me = await db.collection('users').findOne({ id: id });

    if (!me) throw new Error('Unknown token.')

    return me
  },
}

export { Query as default }
