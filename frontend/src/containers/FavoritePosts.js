import React, { Component } from 'react'
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'

import { Query } from 'react-apollo'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import {
  FAVORITE_POSTS_QUERY,
  POSTS_SUBSCRIPTION
} from '../lib/graphql'

import Post from '../components/Post'

let unsubscribeFavoritePosts = null

class FavoritePosts extends Component {

  render() {
    const { isAuth, me } = this.props;

    return (
      <Container style={{ width: "100%", padding: "0" }} >
        <Row>
          <Col xs="6">
            <Query query={FAVORITE_POSTS_QUERY} fetchPolicy={"cache-and-network"}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(((</p>;

                const favoritePosts = data.favoritePosts;
                const posts = favoritePosts.map((post, id) => (
                  <Post {...post} subName={post.sub.name} key={id} />
                ))

                if (!unsubscribeFavoritePosts)
                  unsubscribeFavoritePosts = subscribeToMore({
                    document: POSTS_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;

                      const { mutation, data } = subscriptionData.data.post;
                      const subscriptionPostLikes = data.likes;
                      console.log(data)
                      const likeThisPost = (subscriptionPostLikes.filter(likeItem => {
                        return likeItem.user.username === me.username;
                      })).length > 0;
                      if (!likeThisPost) return prev;

                      const originalFavoritePostsData = prev.favoritePosts;

                      if (mutation === "UPDATED") {
                        const updatedPost = data;
                        const oldPost = originalFavoritePostsData.find(post => post.id === updatedPost.id);
                        const oldPostIndex = originalFavoritePostsData.indexOf(oldPost);
                        const updatedPosts = originalFavoritePostsData.map((post, index) => {
                          if (index === oldPostIndex)
                            return updatedPost;
                          else
                            return post;
                        })

                        return {
                          favoritePosts: updatedPosts
                        }
                      } else
                        return prev;
                    }
                  })
                return (
                  <React.Fragment>
                    <h6>Favorite Posts: {me.username}</h6>
                    <ul className="list-group list-group-flush" style={{ width: "100%" }}>
                      {posts}
                    </ul>
                  </React.Fragment>
                )
              }}
            </Query>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withAuthGuard(FavoritePosts)
