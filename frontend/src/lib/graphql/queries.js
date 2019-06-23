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

export const ME_QUERY = gql`
	query Me {
		me {
			username
		}
	}
`

export const MESSAGES_QUERY = gql`
	query Messages {
		messages {
			body
			sentAt
			user {
				username
			}
		}
	}
`