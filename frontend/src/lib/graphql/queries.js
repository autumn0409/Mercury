import { gql } from 'apollo-boost'

export const USERS_QUERY = gql`
  query {
    users {
      id
      username
      posts {
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
          like
        }
      }
    }
  }
`

export const POSTS_QUERY = gql` 
query {
  posts {
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
      like
    }
}
}
`

export const ME_QUERY = gql`
	query Me {
		me {
      username
      age
      email
		}
	}
`
export const SUBS_QUERY = gql`
  query{
    subs{
      name
      id
      posts{
        title 
      }
    }
  }
`