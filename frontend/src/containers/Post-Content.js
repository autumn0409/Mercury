import React,{Component} from 'react';
import { Query } from 'react-apollo'
import {FIND_POST_QUERY,POSTS_SUBSCRIPTION}from '../lib/graphql'
import{Jumbotron,Button} from 'reactstrap'
let unsubscribe = null

class Example extends Component{
  constructor(props){
    super(props);
    

  }
  render(){
  console.log(this.props.match.params.id)
      return (
        <div>
          <Query 
          query={FIND_POST_QUERY}
          variables={{ id:this.props.match.params.id }}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>

                console.log(data.findPostById)
                const post = data.findPostById
                

                if (!unsubscribe)
                  unsubscribe = subscribeToMore({
                    document: POSTS_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      const newPost = subscriptionData.data.post.data

                      return {
                        ...prev,
                        posts: [newPost, ...prev.posts]
                      }
                    }
                  })
                return (
                  <Jumbotron>
                  <h4 className="display-6">{post.title}</h4>
                  <small>posted by {post.author.username}</small>
                  <hr className="my-1" />
                  <p></p>
                  <p className="lead">{post.body}</p>
                  <hr className="my-1" />
                  <p className="lead">
                  <div>
                    <svg className="like" version="1.1" width="50" height="24" viewBox="0 0 24 24" >
                      <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z"></path>
                    </svg>
                    <svg  className="dislike" version="1.1" width="50" height="24" viewBox="0 0 24 24">
                      <path d="M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V13.91L1,14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z"></path>
                    </svg>
                    {post.dislikeNum}
            
                  </div>
                  </p>
                </Jumbotron>
                )
              }}
            </Query>
            
         
        </div>
      );
  }

};

export default Example;