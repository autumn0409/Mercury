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
    
    }
}
}
`
