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
      throw Error('Email taken');
    }

    const usernameTaken = await checkUsernameTaken(db, args.data.username);
    if (usernameTaken) {
      throw Error('Username taken');
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
  login: async (parent, args, { db }) => {
    const user = await db.collection('users').findOne({ username: args.data.username })
    if (!user) throw Error('Unable to login.')

    const isMatch = await bcrypt.compare(args.data.password, user.password)
    if (!isMatch) throw Error('Invalid credentials.')

    return {
      user,
      token: generateToken(user.id)
    }
  },
  deleteUser: async (parent, args, { db, request }, info) => {
    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    while (true) {
      const deleteResult = await db.collection('posts').findOneAndDelete({ author: userId });
      const deletedPost = deleteResult.value;

      if (deletedPost === null) {
        break;
      } else {
        db.collection('comments').deleteMany({ post: deletedPost.id }, (err, result) => {
          if (err)
            throw err;
        })

        db.collection('likes').deleteMany({ post: deletedPost.id }, (err, result) => {
          if (err)
            throw err;
        })
      }
    }

    db.collection('comments').deleteMany({ author: userId }, (err, result) => {
      if (err)
        throw err;
    })

    db.collection('likes').deleteMany({ user: userId }, (err, result) => {
      if (err)
        throw err;
    })

    db.collection('users').deleteOne({ id: userId });

    return user;
  },
  updateUser: async (parent, args, { db, request }, info) => {
    const { data } = args;

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    if (typeof data.email === 'string') {
      const emailTaken = await checkEmailTaken(db, data.email);

      if (emailTaken) {
        throw Error('Email taken')
      }

      db.collection('users').updateOne({ id: userId }, { $set: { email: data.email } });
      user.email = data.email
    }

    if (typeof data.username === 'string') {
      const usernameTaken = await checkUsernameTaken(db, data.username);

      if (usernameTaken) {
        throw Error('Username taken')
      }

      db.collection('users').updateOne({ id: userId }, { $set: { username: data.username } });
      user.username = data.username
    }

    if (typeof data.age !== 'undefined') {
      db.collection('users').updateOne({ id: userId }, { $set: { age: data.age } });
      user.age = data.age
    }

    return user
  },
  createSub: async (parent, args, { db, pubsub }, info) => {

    const subExists = await db.collection('subs').findOne({ name: args.data.name });
    if (subExists) {
      throw Error('Sub exists')
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

    const post = await db.collection('posts').findOne({ id: args.id });

    if (!post) {
      throw Error('Post not found');
    }
    if (post.author !== userId) {
      throw Error('No authorization');
    }

    db.collection('posts').deleteOne({ id: args.id });

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
      throw Error('Post not found');
    }
    if (post.author !== userId) {
      throw Error('No authorization');
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
      throw Error('Unable to find post');
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
  deleteComment: async (parent, args, { db, pubsub, request }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const comment = await db.collection('comments').findOne({ id: args.id });

    if (!comment) {
      throw Error('Comment not found')
    }
    if (comment.author !== userId) {
      throw Error('No authorization');
    }

    db.collection('comments').deleteOne({ id: args.id });

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })

    return comment;
  },
  updateComment: async (parent, args, { db, pubsub, request }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const { id, data } = args
    const comment = await db.collection('comments').findOne({ id: id });

    if (!comment) {
      throw Error('Comment not found')
    }
    if (comment.author !== userId) {
      throw Error('No authorization');
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
      throw Error('Unable to find post');
    }

    const hasLikedOrDisLiked = await db.collection('likes').findOne({
      $and: [
        { user: userId }, { post: args.data.post }]
    })

    const sameLike = await db.collection('likes').findOne({
      $and: [
        { user: userId }, { post: args.data.post }, { like: args.data.like }]
    })

    if (hasLikedOrDisLiked) {
      if (sameLike)
        throw new Error(`Like exists: ${hasLikedOrDisLiked.id}`);
      else
        throw new Error(`Change like: ${hasLikedOrDisLiked.id}`);
    }

    const like = {
      id: uuidv4(),
      user: userId,
      ...args.data
    }

    const newLikeData = new Like({
      id: like.id,
      user: like.user,
      post: like.post,
      like: like.like,
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
  deleteLike: async (parent, args, { db, pubsub, request }, info) => {

    const userId = getUserId(request);
    const user = await User.findOne({ id: userId });
    if (!user)
      throw Error('Not logged in.');

    const like = await db.collection('likes').findOne({ id: args.id });

    if (!like) {
      throw Error('Like not found')
    }
    if (like.user !== userId) {
      throw Error('No authorization');
    }

    db.collection('likes').deleteOne({ id: args.id });

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