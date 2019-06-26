import { gql } from 'apollo-boost'
import * as Yup from 'yup'

export const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $title: String!
    $body: String!
    $published: Boolean!
    $sub: ID!
  ) {
    createPost(
      data: {
        title: $title
        body: $body
        published: $published
        sub: $sub
      }
    ) {
      id
      title
      body
      published
    }
  }
`



export const CREATE_LIKE_MUTATION = gql`
  mutation createLike(
    $post: ID!
    $like: Boolean!
  ) {
    createLike(
      data: {
        post: $post
        like: $like
      }
    ) {
      id
      post {
        id
        title 
        body
      }
      user {
        id
        username
      }
      like
    }
  }
`

export const DELETE_LIKE_MUTATION = gql`
  mutation deleteLike($id: ID!) {
    deleteLike(id: $id) {
      id
      post {
        id
        title 
        body
      }
      user {
        id
        username
      }
      like
    }
  }
`

export const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: ID!) {
    deleteComment(id: $id) {
      id
      post {
        id
        title 
        body
      }
      author {
        id
        username
      }
      text
    }
  }
`

export const EDIT_COMMENT_MUTATION = gql`
  mutation editComment($id: ID!, $text: String) {
    updateComment(
      id: $id, 
      data: {
        text: $text
      }) {
      id
      post {
        id
        title 
        body
      }
      author {
        id
        username
      }
      text
    }
  }
`


/**
 * Mutations
 */
export const REGISTER_MUTATION = gql`
  mutation createUser($username: String!, $password: String!, $email: String!, $age: Int!)
  {
    createUser(data:{
      username: $username,password: $password,
      email: $email, age: $age
    }){
      user{
        id
        username
      }token
    }
  }
`

export const LOGIN_MUTATION = gql`
	mutation Login($username: String!, $password: String!) {
		login(data: { username: $username, password: $password }) {
			token
		}
	}
`

/**
 * Validation Schemas
 */
export const REGISTER_SCHEMA = Yup.object().shape({
  username: Yup.string()
    .min(3)
    .required('Username is required.'),
  password: Yup.string()
    .min(8)
    .required('Password is required.'),
  email: Yup.string()
    .email()
    .required('Email is required'),
  age: Yup.number().required("age is required")


})

export const LOGIN_SCHEMA = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  password: Yup.string().required('Password is required.')
})
