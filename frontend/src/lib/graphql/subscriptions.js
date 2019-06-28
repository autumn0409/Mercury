import { gql } from 'apollo-boost'

export const POSTS_SUBSCRIPTION = gql`
  subscription {
    post {
      mutation
      data {
        id
        sub {
          id
          name
        }
        title 
        author{
          id
          username
        }
        body
        likes{
          id
          user{
            id
            username
          }
          like
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
        commentVotes {
          id
          like
          user {
            id
            username
          }
        }
      }
    }
  }
`

export const COMMENTVOTES_SUBSCRIPTION = gql`
  subscription commentVote($commentId: ID!) {
    commentVote(commentId: $commentId) {
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
