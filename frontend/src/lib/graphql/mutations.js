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
      title
      body
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

export const CREATE_MESSAGE_MUTATION = gql`
	mutation CreateMessage($body: String!, $sentAt: String!) {
		createMessage(data: { body: $body, sentAt: $sentAt }) {
			body
		}
	}
`

export const DELETE_ALL_MESSAGES_MUTATION = gql`
	mutation DeleteAll {
		deleteAll
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
