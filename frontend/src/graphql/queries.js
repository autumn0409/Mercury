import { gql } from 'apollo-boost'

export const USERS_QUERY = gql`
  query {
    users {
      id
      name
      posts {
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

export const POSTS_QUERY = gql` 
query {
  posts {
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
`
