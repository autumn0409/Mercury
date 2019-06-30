import React, { Component } from 'react'
import { Query } from 'react-apollo'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import {
  ME_QUERY,
  POSTS_SUBSCRIPTION
} from '../lib/graphql'

import Post from '../components/Post'

let unsubscribeMyPosts = null

class MyPosts extends Component {

  render() {
    return (
      <Container style={{width:'100%'}}>
            <Query query={ME_QUERY} fetchPolicy={"cache-and-network"}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(((</p>;

                const me = data.me;
                const posts = me.posts.map((post, id) => (
                  <Post {...post} subName={post.sub.name} key={id} />
                ))

                if (!unsubscribeMyPosts)
                  unsubscribeMyPosts = subscribeToMore({
                    document: POSTS_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;

                      const { mutation, data } = subscriptionData.data.post;
                      const originalMyPostsData = prev.me;

                      if (data.author.username !== me.username) return prev;

                      if (mutation === "CREATED") {
                        const newPost = data;

                        return {
                          me: {
                            ...originalMyPostsData,
                            posts: [...originalMyPostsData.posts, newPost],
                          }
                        }
                      }
                      else if (mutation === "UPDATED") {
                        const updatedPost = data;
                        const oldPost = originalMyPostsData.posts.find(post => post.id === updatedPost.id);
                        const oldPostIndex = originalMyPostsData.posts.indexOf(oldPost);
                        const updatedPosts = originalMyPostsData.posts.map((post, index) => {
                          if (index === oldPostIndex)
                            return updatedPost;
                          else
                            return post;
                        })

                        return {
                          me: {
                            ...originalMyPostsData,
                            posts: updatedPosts,
                          }
                        }
                      }
                      else {
                        const deletedPost = data;
                        const updatedPosts = originalMyPostsData.posts.filter(post => {
                          return post.id !== deletedPost.id;
                        });

                        return {
                          me: {
                            ...originalMyPostsData,
                            posts: updatedPosts,
                          }
                        }
                      }
                    }
                  })
                return (
                  <React.Fragment>
                    <h6 style={{padding:"20px"}}>Posts by {me.username}</h6>
                    <ul className="list-group list-group-flush" style={{ width: "100%" }}>
                      {posts}
                    </ul>
                  </React.Fragment>
                )
              }}
            </Query>
      </Container>
    )
  }
}

export default MyPosts
