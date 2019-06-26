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
          id
          username
        }
        likes {
          user {
            id
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
        id
        user {
          id
          username
        }
        like
      }
    }
  }
`

export const COMMENTS_SUBSCRIPTION = gql`
  subscription comment($postId: ID!) {
    comment(postId: $postId) {
      mutation
      data {
        id
        author {
          id
          username
        }
        text
      }
    }
  }
`
