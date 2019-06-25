import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo'
import {
  FIND_POST_QUERY,
  CREATE_LIKE_MUTATION,
  DELETE_LIKE_MUTATION,
  COMMENTS_SUBSCRIPTION,
  LIKES_SUBSCRIPTION
} from '../lib/graphql'
import { Jumbotron, Button } from 'reactstrap'
import CommentList from './CommentList/CommentList'

let unsubscribeComments;
let unsubscribeLikes;


class Example extends Component {
  componentDidMount = () => {
    unsubscribeComments = null;
    unsubscribeLikes = null;
  }

  handleLike = () => {
    const { id } = this.props.match.params;

    this.createLike({
      variables: {
        post: id,
        like: true,
      }
    }).catch(e => {
      if (e.graphQLErrors) {
        const message = e.graphQLErrors[0].message;
        if (message.includes("Like exists")) {
          const likeId = message.replace('Like exists: ', '');
          this.deleteLike({
            variables: {
              id: likeId,
            }
          })
        } else if (message.includes("Change like")) {
          const likeId = message.replace('Change like: ', '');
          this.deleteLike({
            variables: {
              id: likeId,
            }
          })
          this.createLike({
            variables: {
              post: id,
              like: true,
            }
          })
        }
      }
    })
  }

  handleDislike = () => {
    const { id } = this.props.match.params;

    this.createLike({
      variables: {
        post: id,
        like: false,
      }
    }).catch(e => {
      if (e.graphQLErrors) {
        const message = e.graphQLErrors[0].message;

        if (message.includes("Like exists")) {
          const likeId = message.replace('Like exists: ', '');
          this.deleteLike({
            variables: {
              id: likeId,
            }
          })
        } else if (message.includes("Change like")) {
          const likeId = message.replace('Change like: ', '');
          this.deleteLike({
            variables: {
              id: likeId,
            }
          })
          this.createLike({
            variables: {
              post: id,
              like: false,
            }
          })
        }
      }
    })
  }

  render() {
    const { id } = this.props.match.params;

    return (
      <React.Fragment>
        <Query
          query={FIND_POST_QUERY}
          variables={{ id: id }}>
          {({ loading, error, data, subscribeToMore }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error :(((</p>

            const post = data.findPostById;
            const likeNum = post.likes.filter(likeItem => {
              return likeItem.like === true
            }).length;
            const dislikeNum = post.likes.filter(likeItem => {
              return likeItem.like === false
            }).length;

            if (!unsubscribeComments)
              unsubscribeComments = subscribeToMore({
                document: COMMENTS_SUBSCRIPTION,
                variables: { postId: id },
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev

                  const { mutation, data } = subscriptionData.data.comment;
                  const originalPost = prev.findPostById;

                  if (mutation === "CREATED") {
                    const newComment = data;

                    return {
                      findPostById: {
                        ...originalPost,
                        comments: [...originalPost.comments, newComment],
                      }
                    }
                  }
                  else if (mutation === "UPDATED") {
                    const updatedComment = data;
                    const oldComment = originalPost.comments.find(comment => comment.id === updatedComment.id);
                    const oldCommentIndex = originalPost.comments.indexOf(oldComment);
                    const updatedComments = originalPost.comments.map((comment, index) => {
                      if (index === oldCommentIndex)
                        return updatedComment;
                      else
                        return comment;
                    })

                    return {
                      findPostById: {
                        ...originalPost,
                        comments: updatedComments,
                      }
                    }
                  }
                  else {
                    const deletedComment = data;
                    const updatedComments = originalPost.comments.filter(comment => {
                      return comment.id !== deletedComment.id;
                    });

                    return {
                      findPostById: {
                        ...originalPost,
                        comments: updatedComments,
                      }
                    }
                  }
                }
              })

            if (!unsubscribeLikes)
              unsubscribeLikes = subscribeToMore({
                document: LIKES_SUBSCRIPTION,
                variables: { postId: id },
                updateQuery: (prev, { subscriptionData }) => {
                  console.log(subscriptionData.data)
                  if (!subscriptionData.data) return prev;

                  const { mutation, data } = subscriptionData.data.like;
                  const originalPost = prev.findPostById;

                  if (mutation === "CREATED") {
                    const newLike = data;

                    return {
                      findPostById: {
                        ...originalPost,
                        likes: [...originalPost.likes, newLike],
                      }
                    }
                  }

                  else {
                    const deletedLike = data;
                    const updatedLikes = originalPost.likes.filter(like => {
                      return like.id !== deletedLike.id;
                    });

                    return {
                      findPostById: {
                        ...originalPost,
                        likes: updatedLikes,
                      }
                    }
                  }
                }
              })

            return (
              <React.Fragment>
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
                <div>
                  <Button onClick={this.handleLike}>Like: {likeNum}</Button>
                  <Button onClick={this.handleDislike}>DisLike: {dislikeNum}</Button>
                </div>
                <CommentList comments={post.comments} />
              </React.Fragment>
            )
          }}
        </Query>
        <Mutation mutation={CREATE_LIKE_MUTATION}>
          {createLike => {
            this.createLike = createLike;
            return null;
          }}
        </Mutation>
        <Mutation mutation={DELETE_LIKE_MUTATION}>
          {deleteLike => {
            this.deleteLike = deleteLike;
            return null;
          }}
        </Mutation>
      </React.Fragment>
    );
  }

};

export default Example;