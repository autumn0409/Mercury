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
                    <Button color="primary">Learn More</Button>
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