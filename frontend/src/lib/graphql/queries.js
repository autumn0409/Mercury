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
<<<<<<< HEAD
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
=======
>>>>>>> 152b6d7be71157d5612fdafd01a1061466bf8fb3
`