import uuidv4 from 'uuid/v4'

import User from '../models/user';
import Sub from '../models/sub';
import Post from '../models/post';
import Comment from '../models/comment';
import Like from '../models/like';

import { checkUserExists, checkPostExists, checkEmailTaken } from '../utils/checking';

const Mutation = {
  async createUser(parent, args, { db }, info) {

    const emailTaken = await checkEmailTaken(db, args.data.email);

    if (emailTaken) {
      throw new Error('Email taken')
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
  // deleteUser(parent, args, { db }, info) {
  //   const userIndex = db.users.findIndex(user => user.id === args.id)

  //   if (userIndex === -1) {
  //     throw new Error('User not found')
  //   }

  //   const deletedUsers = db.users.splice(userIndex, 1)

  //   db.posts = db.posts.filter(post => {
  //     const match = post.author === args.id

  //     if (match) {
  //       db.comments = db.comments.filter(comment => comment.post !== post.id)
  //     }

  //     return !match
  //   })
  //   db.comments = db.comments.filter(comment => comment.author !== args.id)

  //   return deletedUsers[0]
  // },
  // updateUser(parent, args, { db }, info) {
  //   const { id, data } = args
  //   const user = db.users.find(user => user.id === id)

  //   if (!user) {
  //     throw new Error('User not found')
  //   }

  //   if (typeof data.email === 'string') {
  //     const emailTaken = db.users.some(user => user.email === data.email)

  //     if (emailTaken) {
  //       throw new Error('Email taken')
  //     }

  //     user.email = data.email
  //   }

  //   if (typeof data.name === 'string') {
  //     user.name = data.name
  //   }

  //   if (typeof data.age !== 'undefined') {
  //     user.age = data.age
  //   }

  //   return user
  // },
  createSub(parent, args, { db, pubsub }, info) {

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

    const result = await db.collection('posts').findOneAndDelete({ $and: [{ id: args.id }, { published: true }] });
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
  // updatePost(parent, args, { db, pubsub }, info) {
  //   const { id, data } = args
  //   const post = db.posts.find(post => post.id === id)
  //   const originalPost = { ...post }

  //   if (!post) {
  //     throw new Error('Post not found')
  //   }

  //   if (typeof data.title === 'string') {
  //     post.title = data.title
  //   }

  //   if (typeof data.body === 'string') {
  //     post.body = data.body
  //   }

  //   if (typeof data.published === 'boolean') {
  //     post.published = data.published

  //     if (originalPost.published && !post.published) {
  //       pubsub.publish('post', {
  //         post: {
  //           mutation: 'DELETED',
  //           data: originalPost
  //         }
  //       })
  //     } else if (!originalPost.published && post.published) {
  //       pubsub.publish('post', {
  //         post: {
  //           mutation: 'CREATED',
  //           data: post
  //         }
  //       })
  //     }
  //   } else if (post.published) {
  //     pubsub.publish('post', {
  //       post: {
  //         mutation: 'UPDATED',
  //         data: post
  //       }
  //     })
  //   }

  //   return post
  // },
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
  //   deleteComment(parent, args, { db, pubsub }, info) {
  //     const commentIndex = db.comments.findIndex(
  //       comment => comment.id === args.id
  //     )

  //     if (commentIndex === -1) {
  //       throw new Error('Comment not found')
  //     }

  //     const [deletedComment] = db.comments.splice(commentIndex, 1)
  //     pubsub.publish(`comment ${deletedComment.post}`, {
  //       comment: {
  //         mutation: 'DELETED',
  //         data: deletedComment
  //       }
  //     })

  //     return deletedComment
  //   },
  //   updateComment(parent, args, { db, pubsub }, info) {
  //     const { id, data } = args
  //     const comment = db.comments.find(comment => comment.id === id)

  //     if (!comment) {
  //       throw new Error('Comment not found')
  //     }

  //     if (typeof data.text === 'string') {
  //       comment.text = data.text
  //     }

  //     pubsub.publish(`comment ${comment.post}`, {
  //       comment: {
  //         mutation: 'UPDATED',
  //         data: comment
  //       }
  //     })

  //     return comment
  //   }
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