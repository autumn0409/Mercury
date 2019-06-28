import React, { Component } from 'react'
import { Query } from 'react-apollo'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import {
  SUB_QUERY,
  POSTS_SUBSCRIPTION
} from '../lib/graphql'

import Post from '../components/Post'

let unsubscribePosts = null

class SubPage extends Component {

  render() {
    const subName = this.props.match.params.subName;

    return (
      <Container  >
        <Row>
          <Col xs="6">
            <Query query={SUB_QUERY} fetchPolicy={"cache-and-network"} variables={{ query: subName }}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>

                const sub_object = data.sub;

                const posts = sub_object.posts.map((post, id) => (
                  <Post {...post} subName={subName} key={id} />
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
