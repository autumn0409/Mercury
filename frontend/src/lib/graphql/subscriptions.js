import { gql } from 'apollo-boost'

export const POSTS_SUBSCRIPTION = gql`
  subscription {
    post {
      mutation
      data {
        id
        title
        body
        author {
          username
        }
        likes {
          user {
            username
          }
        }
      }
    }
  }
`

export const LIKES_SUBSCRIPTION = gql`
  subscription like($postId: ID!) {
    like(postId: $postId) {
      mutation
      data {
        user {
          id
          username
        }
        post {
          id
        }
        like
      }
    }
  }
`
