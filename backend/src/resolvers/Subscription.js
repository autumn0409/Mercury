import { checkPostExists } from '../utils/checking';

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
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post')
    }
  }
}

export { Subscription as default }
