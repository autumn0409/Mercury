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
        id
        user {
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

export const COMMENTS_SUBSCRIPTION = gql`
  subscription comment($postId: ID!) {
    comment(postId: $postId) {
      mutation
      data {
        id
        author {
          username
        }
        post {
          id
        }
        text
      }
    }
  }
`
