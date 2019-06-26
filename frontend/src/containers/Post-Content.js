import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo'
import {
  FIND_POST_QUERY,
  CREATE_COMMENT_MUTATION,
  CREATE_LIKE_MUTATION,
  DELETE_LIKE_MUTATION,
  COMMENTS_SUBSCRIPTION,
  LIKES_SUBSCRIPTION
} from '../lib/graphql'
import { Jumbotron, Input, Button } from 'reactstrap'
import CommentList from './CommentList/CommentList'

let unsubscribeComments;
let unsubscribeLikes;

class Example extends Component {
  constructor(props) {
    super(props);
    this.inputEl = null;
    this.state = {
      inputText: ""
    }
  }

  componentWillMount = () => {
    unsubscribeComments = null;
    unsubscribeLikes = null;
  }

  handleInputChange = (e) => {
    this.setState({
      inputText: e.target.value
    })
  }

  handleCreateComment = () => {
    const { postId } = this.props.match.params;
    this.createComment({
      variables: {
        text: this.state.inputText,
        post: postId,
      }
    }).then(() => {
      this.setState({
        inputText: ""
      })
    })
  }

  handleLike = () => {
    const { postId } = this.props.match.params;

    this.createLike({
      variables: {
        post: postId,
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
              post: postId,
              like: true,
            }
          })
        }
      }
    })
  }

  handleDislike = () => {
    const { postId } = this.props.match.params;

    this.createLike({
      variables: {
        post: postId,
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
              post: postId,
              like: false,
            }
          })
        }
      }
    })
  }

  render() {
    const { postId } = this.props.match.params;
    return (
      <React.Fragment>
        <Query
          query={FIND_POST_QUERY}
          variables={{ id: postId }}
          fetchPolicy={"cache-and-network"}>
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
                variables: { postId: postId },
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
                variables: { postId: postId },
                updateQuery: (prev, { subscriptionData }) => {
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
                    <svg className="like" version="1.1" width="50" height="24" viewBox="0 0 24 24" onClick={this.handleLike}>
                      <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z"></path>
                    </svg>
                    {likeNum}
                    <svg className="dislike" version="1.1" width="50" height="24" viewBox="0 0 24 24" onClick={this.handleDislike}>
                      <path d="M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V13.91L1,14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z"></path>
                    </svg>
                    {dislikeNum}
                  </p>
                </Jumbotron>
                <div className='d-flex flex-column'>
                  <Input
                    type='textarea'
                    placeholder="Write down your comment:"
                    innerRef={el => { this.inputEl = el }}
                    value={this.state.inputText}
                    onChange={this.handleInputChange}
                  />
                  <Button
                    className='align-self-end'
                    onClick={this.handleCreateComment}>Send</Button>
                </div>
                <CommentList comments={post.comments} />
              </React.Fragment>
            )
          }}
        </Query>
        <Mutation mutation={CREATE_COMMENT_MUTATION}>
          {createComment => {
            this.createComment = createComment;
            return null;
          }}
        </Mutation>
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