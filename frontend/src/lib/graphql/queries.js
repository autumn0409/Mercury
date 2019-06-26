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
          id
          username
        }
        likes {
          id
          user {
            id
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
      id
      username
    }
    likes {
      user {
        id
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
      id
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
        id
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

export const FIND_POST_QUERY = gql`
query findPostById($id: ID!){
  findPostById(
    id: $id
  ){
    id
    title
    author{
      id
      username
    }
    body
    likes{
      id
      like
      user{
        id
        username
      }
    }
    comments{
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