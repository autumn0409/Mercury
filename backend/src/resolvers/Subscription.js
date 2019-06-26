import { checkPostExists, checkCommentExists } from '../utils/checking';

const Subscription = {
  comment: {
    async subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = await checkPostExists(db, postId);

      if (!post) {
        throw new Error('Post not found')
      }

      return pubsub.asyncIterator(`comment ${postId}`)
    }
  },
  like: {
    async subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = await checkPostExists(db, postId);

      if (!post) {
        throw new Error('Post not found')
      }

      return pubsub.asyncIterator(`like ${postId}`)
    }
  },
  commentVote: {
    async subscribe(parent, { commentId }, { db, pubsub }, info) {
      const comment = await checkCommentExists(db, commentId);

      if (!comment) {
        throw new Error('Comment not found')
      }

      return pubsub.asyncIterator(`commentVote ${commentId}`)
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post')
    }
  }
}

export { Subscription as default }
