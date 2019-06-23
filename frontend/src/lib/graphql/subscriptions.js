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
          name
        }
        likes {
          user {
            name
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
          name
        }
        post {
          id
        }
      }
    }
  }
`
