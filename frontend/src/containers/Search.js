import React, { Component } from 'react'
import { Query } from 'react-apollo'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import {
  POSTS_QUERY,
  POSTS_SUBSCRIPTION
} from '../lib/graphql'

import Post from '../components/Post'

let unsubscribePosts = null

class SubPage extends Component {

  render() {
    const subName = this.props.match.params.name;
    const target = this.props.match.params.name;
    console.log(subName)
    return (

      <Container  >
        <Row>
          <Col>
            <Query query={POSTS_QUERY} fetchPolicy={"cache-and-network"} variables={{ query: subName }}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>
                console.log(data.posts)
                const result = data.posts.filter(post =>{
                    post.title.toLowerCase().includes(target)
                });

                data.posts.map((post,id)=>{
                    if(post.title.toLowerCase().includes(target))
                        {result.push(post)
                    }
                })
                if(result.length == 0){
                    return <React.Fragment>
                        <h1>OOPS...</h1>
                        <h6>No post found</h6>
                        <h6>try another keyword</h6>
                    </React.Fragment>
                }
                
                const posts = result.map((post, id) => (
                  <Post {...post} key={id} />
                ))

                if (!unsubscribePosts)
                  unsubscribePosts = subscribeToMore({
                    document: POSTS_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;

                      const { mutation, data } = subscriptionData.data.post;
                      const originalSubData = prev.sub;

                      if (data.sub.name !== subName) return prev;

                      if (mutation === "CREATED") {
                        const newPost = data;

                        return {
                          sub: {
                            ...originalSubData,
                            posts: [...originalSubData.posts, newPost],
                          }
                        }
                      }
                      else if (mutation === "UPDATED") {
                        const updatedPost = data;
                        const oldPost = originalSubData.posts.find(post => post.id === updatedPost.id);
                        const oldPostIndex = originalSubData.posts.indexOf(oldPost);
                        const updatedPosts = originalSubData.posts.map((post, index) => {
                          if (index === oldPostIndex)
                            return updatedPost;
                          else
                            return post;
                        })

                        return {
                          sub: {
                            ...originalSubData,
                            posts: updatedPosts,
                          }
                        }
                      }
                      else {
                        const deletedPost = data;
                        const updatedPosts = originalSubData.posts.filter(post => {
                          return post.id !== deletedPost.id;
                        });

                        return {
                          sub: {
                            ...originalSubData,
                            posts: updatedPosts,
                          }
                        }
                      }
                    }
                  })
                return (
                  <ul className="list-group list-group-flush" style={{ width: "100%" }}>
                    {posts}
                  </ul>)
              }}
            </Query>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default SubPage
