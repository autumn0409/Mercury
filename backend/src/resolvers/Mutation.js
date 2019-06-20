import uuidv4 from 'uuid/v4'
import bcrypt from 'bcryptjs'

import User from '../models/user';
import Sub from '../models/sub';
import Post from '../models/post';
import Comment from '../models/comment';
import Like from '../models/like';

import hashPassword from '../utils/hashPassword'
import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'

import { checkPostExists, checkEmailTaken, checkUsernameTaken } from '../utils/checking';

const Mutation = {
  createUser: async (parent, args, { db }, info) => {

    const emailTaken = await checkEmailTaken(db, args.data.email);
    if (emailTaken) {
      throw new Error('Email taken');
    }

    const usernameTaken = await checkUsernameTaken(db, args.data.username);
    if (usernameTaken) {
      throw new Error('Username taken');
    }

    const password = await hashPassword(args.data.password);

    const newUserData = new User({
      id: uuidv4(),
      password: password,
      username: args.data.username,
      email: args.data.email,
      age: args.data.age,
    })

    newUserData.save();

    return {
      user: newUserData,
      token: generateToken(newUserData.id)
    };
  },
  login: async (parent, args) => {
    const user = await User.findOne({ username: args.data.username })
    if (!user) throw new Error('Unable to login.')

    const isMatch = await bcrypt.compare(args.data.password, user.password)
    if (!isMatch) throw new Error('Invalid credentials.')

    return {
      user,
      token: generateToken(user.id)
    }
  },
  // async deleteUser(parent, args, { db }, info) {
  //   const result = await db.collection('users').findOneAndDelete({ id: args.id });
  //   const user = result.value;
  //   if (user === null) {
  //     throw new Error('User not found')
  //   }

  //   while (true) {
  //     const deleteResult = await db.collection('posts').findOneAndDelete({ author: args.id });
  //     const deletedPost = deleteResult.value;

  //     if (deletedPost === null) {
  //       break;
  //     } else {
  //       db.collection('comments').deleteMany({ post: deletedPost.id }, (err, result) => {
  //         if (err)
  //           throw err;
  //       })

  //       db.collection('likes').deleteMany({ post: deletedPost.id }, (err, result) => {
  //         if (err)
  //           throw err;
  //       })
  //     }
  //   }

  //   db.collection('comments').deleteMany({ author: args.id }, (err, result) => {
  //     if (err)
  //       throw err;
  //   })

  //   db.collection('likes').deleteMany({ user: args.id }, (err, result) => {
  //     if (err)
  //       throw err;
  //   })

  //   return user;
  // },
  // async updateUser(parent, args, { db }, info) {
  //   const { id, data } = args
  //   const user = await db.collection('users').findOne({ id: id });

  //   if (user === null) {
  //     throw new Error('User not found')
  //   }

  //   if (typeof data.email === 'string') {
  //     const emailTaken = await checkEmailTaken(db, data.email);

  //     if (emailTaken) {
  //       throw new Error('Email taken')
  //     }

  //     db.collection('users').updateOne({ id: id }, { $set: { email: data.email } });
  //     user.email = data.email
  //   }

  //   if (typeof data.name === 'string') {
  //     const nameTaken = await checkUsernameTaken(db, data.name);

  //     if (nameTaken) {
  //       throw new Error('Name taken')
  //     }

  //     db.collection('users').updateOne({ id: id }, { $set: { name: data.name } });
  //     user.name = data.name
  //   }

  //   if (typeof data.age !== 'undefined') {
  //     db.collection('users').updateOne({ id: id }, { $set: { age: data.age } });
  //     user.age = data.age
  //   }

  //   return user
  // },
  createSub: async (parent, args, { db, pubsub }, info) => {

    const subExists = await db.collection('subs').findOne({ name: args.data.name });
    if (subExists) {
      throw new Error('Sub exists')
    }

    const sub = {
      id: uuidv4(),
      ...args.data
    }

    const newSubData = new Sub({
      id: sub.id,
      name: sub.name,
    })

    newSubData.save();

    return sub;
  },
  createPost: async (parent, args, { db, pubsub, request }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const post = {
      id: uuidv4(),
      author: userId,
      ...args.data
    }

    const newPostData = new Post({
      id: post.id,
      sub: post.sub,
      title: post.title,
      body: post.body,
      published: post.published,
      author: post.author,
    })

    newPostData.save();

    if (args.data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    return post;
  },
  deletePost: async (parent, args, { db, pubsub, request }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const result = await db.collection('posts').findOneAndDelete({ id: args.id });
    const post = result.value;
    if (!post) {
      throw new Error('Post not found');
    }

    db.collection('comments').deleteMany({ post: args.id }, (err, result) => {
      if (err)
        throw err;
    })

    db.collection('likes').deleteMany({ post: args.id }, (err, result) => {
      if (err)
        throw err;
    })

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post
  },
  updatePost: async (parent, args, { db, pubsub, request }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const { id, data } = args
    const post = await db.collection('posts').findOne({ id: id });
    const originalPost = { ...post }

    if (!post) {
      throw new Error('Post not found');
    }

    if (typeof data.title === 'string') {
      db.collection('posts').updateOne({ id: id }, { $set: { title: data.title } });
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      db.collection('posts').updateOne({ id: id }, { $set: { body: data.body } });
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      db.collection('posts').updateOne({ id: id }, { $set: { published: data.published } });
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post
  },
  createComment: async (parent, args, { db, pubsub, request }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');;

    const postExists = await checkPostExists(db, args.data.post);

    if (!postExists) {
      throw new Error('Unable to find post');
    }

    const comment = {
      id: uuidv4(),
      author: userId,
      ...args.data
    }

    const newCommentData = new Comment({
      id: comment.id,
      text: comment.text,
      author: comment.author,
      post: comment.post,
    })

    newCommentData.save();

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });

    return comment;
  },
  deleteComment: async (parent, args, { db, pubsub }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const result = await db.collection('comments').findOneAndDelete({ id: args.id });
    const comment = result.value;

    if (!comment) {
      throw new Error('Comment not found')
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })

    return comment;
  },
  updateComment: async (parent, args, { db, pubsub }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const { id, data } = args
    const comment = await db.collection('comments').findOne({ id: id });

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      db.collection('comments').updateOne({ id: id }, { $set: { text: data.text } });
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  },
  createLike: async (parent, args, { db, pubsub, request }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');;

    const postExists = await checkPostExists(db, args.data.post);

    if (!postExists) {
      throw new Error('Unable to find post');
    }

    const like = {
      id: uuidv4(),
      author: userId,
      ...args.data
    }

    const newLikeData = new Like({
      id: like.id,
      user: like.user,
      post: like.post,
    })

    newLikeData.save();

    pubsub.publish(`like ${args.data.post}`, {
      like: {
        mutation: 'CREATED',
        data: like
      }
    });

    return like;
  },
  deleteLike: async (parent, args, { db, pubsub }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const result = await db.collection('likes').findOneAndDelete({ id: args.id });
    const like = result.value;

    if (!like) {
      throw new Error('Like not found')
    }

    pubsub.publish(`like ${like.post}`, {
      like: {
        mutation: 'DELETED',
        data: like
      }
    })

    return like;
  },
}

export { Mutation as default }