import uuidv4 from 'uuid/v4'

import User from '../models/user';
import Sub from '../models/sub';
import Post from '../models/post';
import Comment from '../models/comment';
import Like from '../models/like';

import { checkUserExists, checkPostExists, checkEmailTaken, checkNameTaken } from '../utils/checking';

const Mutation = {
  async createUser(parent, args, { db }, info) {

    const emailTaken = await checkEmailTaken(db, args.data.email);

    if (emailTaken) {
      throw new Error('Email taken');
    }

    const nameTaken = await checkNameTaken(db, args.data.name);

    if (nameTaken) {
      throw new Error('Name taken');
    }

    const user = {
      id: uuidv4(),
      ...args.data
    }

    const newUserData = new User({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    })

    newUserData.save();

    return user;
  },
  async deleteUser(parent, args, { db }, info) {
    const result = await db.collection('users').findOneAndDelete({ id: args.id });
    const user = result.value;
    if (user === null) {
      throw new Error('User not found')
    }

    while (true) {
      const deleteResult = await db.collection('posts').findOneAndDelete({ author: args.id });
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

    db.collection('comments').deleteMany({ author: args.id }, (err, result) => {
      if (err)
        throw err;
    })

    db.collection('likes').deleteMany({ user: args.id }, (err, result) => {
      if (err)
        throw err;
    })

    return user;
  },
  async updateUser(parent, args, { db }, info) {
    const { id, data } = args
    const user = await db.collection('users').findOne({ id: id });

    if (user === null) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = await checkEmailTaken(db, data.email);

      if (emailTaken) {
        throw new Error('Email taken')
      }

      db.collection('users').updateOne({ id: id }, { $set: { email: data.email } });
      user.email = data.email
    }

    if (typeof data.name === 'string') {
      const nameTaken = await checkNameTaken(db, data.name);

      if (nameTaken) {
        throw new Error('Name taken')
      }

      db.collection('users').updateOne({ id: id }, { $set: { name: data.name } });
      user.name = data.name
    }

    if (typeof data.age !== 'undefined') {
      db.collection('users').updateOne({ id: id }, { $set: { age: data.age } });
      user.age = data.age
    }

    return user
  },
  async createSub(parent, args, { db, pubsub }, info) {

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
  // TODOS: update, delete sub
  async createPost(parent, args, { db, pubsub }, info) {

    const userExists = await checkUserExists(db, args.data.author);

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = {
      id: uuidv4(),
      ...args.data
    }

    const newPostData = new Post({
      id: post.id,
      title: post.title,
      body: post.body,
      published: post.published,
      author: post.author,
      sub: post.sub,
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
  async deletePost(parent, args, { db, pubsub }, info) {

    const result = await db.collection('posts').findOneAndDelete({ id: args.id });
    const post = result.value;

    if (post === null) {
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
  async updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args
    const post = await db.collection('posts').findOne({ id: id });
    const originalPost = { ...post }

    if (post === null) {
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
  async createComment(parent, args, { db, pubsub }, info) {

    const userExists = await checkUserExists(db, args.data.author);

    const postExists = await checkPostExists(db, args.data.post);

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post')
    }

    const comment = {
      id: uuidv4(),
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
  async deleteComment(parent, args, { db, pubsub }, info) {
    const result = await db.collection('comments').findOneAndDelete({ id: args.id });
    const comment = result.value;

    if (comment === null) {
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
  async updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args
    const comment = await db.collection('comments').findOne({ id: id });

    if (comment === null) {
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
  async createLike(parent, args, { db, pubsub }, info) {

    const userExists = await checkUserExists(db, args.data.user);

    const postExists = await checkPostExists(db, args.data.post);

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post')
    }

    const like = {
      id: uuidv4(),
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
}

export { Mutation as default }