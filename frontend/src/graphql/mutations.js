import { gql } from 'apollo-boost'

export const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $title: String!
    $body: String!
    $published: Boolean!
    $authorId: ID!
  ) {
    createPost(
      data: {
        title: $title
        body: $body
        published: $published
        author: $authorId
      }
    ) {
      title
      body
      author {
        name
      }
      published
    }
  }
`

export const CREATE_LIKE_MUTATION = gql`
  mutation createLike(
    $user: ID!
    $post: ID!
  ) {
    createLike(
      data: {
        user: $user
        post: $post
      }
    ) {
      id
      post {
        title 
        body
      }
      user {
        name
      }
    }
  }
`