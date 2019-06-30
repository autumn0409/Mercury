
import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo'
import { Jumbotron, Input, Button, ButtonToolbar } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import nl2br from 'react-newline-to-break';

import {
  FIND_POST_QUERY,
  DELETE_POST_MUTATION,
  CREATE_COMMENT_MUTATION,
  CREATE_LIKE_MUTATION,
  DELETE_LIKE_MUTATION,
  COMMENTS_SUBSCRIPTION,
  LIKES_SUBSCRIPTION,
} from '../lib/graphql'
import CommentList from './CommentList/CommentList'
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'

let unsubscribeComments;
let unsubscribeLikes;
let unsubscribePost;

class Example extends Component {
  constructor(props) {
    super(props);
    this.inputEl = null;
    this.state = {
      inputText: "",
      hasLikedBefore: false,
      hasDislikedBefore: false,
      myLikeId: '',
      isAuth: false,
    }
  }

  componentWillMount = () => {
    unsubscribeComments = null;
    unsubscribeLikes = null;
    unsubscribePost = null;
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
    if (!this.props.isAuth)
      return;

    const { postId } = this.props.match.params;

    if (this.state.hasLikedBefore) {
      this.deleteLike({
        variables: {
          id: this.state.myLikeId,
        }
      }).then(() => {
        this.setState({
          hasLikedBefore: false,
          myLikeId: '',
        })
      })
    } else if (this.state.hasDislikedBefore) {
      this.deleteLike({
        variables: {
          id: this.state.myLikeId,
        }
      }).then(() => {
        this.createLike({
          variables: {
            post: postId,
            like: true,
          }
        }).then((res => {
          this.setState({
            hasLikedBefore: true,
            hasDislikedBefore: false,
            myLikeId: res.data.createLike.id,
          })
        }))
      })
    } else {
      this.createLike({
        variables: {
          post: postId,
          like: true,
        }
      }).then((res => {
        this.setState({
          hasLikedBefore: true,
          hasDislikedBefore: false,
          myLikeId: res.data.createLike.id,
        })
      }))
    }
  }

  handleDislike = () => {
    if (!this.props.isAuth)
      return;

    const { postId } = this.props.match.params;

    if (this.state.hasDislikedBefore) {
      this.deleteLike({
        variables: {
          id: this.state.myLikeId,
        }
      }).then(() => {
        this.setState({
          hasDislikedBefore: false,
          myLikeId: '',
        })
      })
    } else if (this.state.hasLikedBefore) {
      this.deleteLike({
        variables: {
          id: this.state.myLikeId,
        }
      }).then(() => {
        this.createLike({
          variables: {
            post: postId,
            like: false,
          }
        }).then((res => {
          this.setState({
            hasLikedBefore: false,
            hasDislikedBefore: true,
            myLikeId: res.data.createLike.id,
          })
        }))
      })
    } else {
      this.createLike({
        variables: {
          post: postId,
          like: false,
        }
      }).then((res => {
        this.setState({
          hasLikedBefore: false,
          hasDislikedBefore: true,
          myLikeId: res.data.createLike.id,
        })
      }))
    }
  }

  handleDeletePost = () => {
    const { postId } = this.props.match.params;
    this.deletePost({
      variables: {
        id: postId
      }
    }).then(() => {
      this.props.history.goBack();
    })
  }

  handleEditPost = () => {
    const { postId } = this.props.match.params;
    this.props.history.push(`/edit/${postId}`);
  }

  setLikeHistory = likes => {
    const { isAuth, me } = this.props;

    if (isAuth) {
      const myLikeOfThisPost = likes.filter(likeItem => {
        return (likeItem.user.username === me.username && likeItem.like === true)
      })

      const myDislikeOfThisPost = likes.filter(likeItem => {
        return (likeItem.user.username === me.username && likeItem.like === false)
      })

      const hasLikedThisPost = (myLikeOfThisPost.length > 0);
      const hasDislikedThisPost = (myDislikeOfThisPost.length > 0);

      if (hasLikedThisPost) {
        this.setState({
          hasLikedBefore: true,
          myLikeId: myLikeOfThisPost[0].id,
        })
      }
      else if (hasDislikedThisPost) {
        this.setState({
          hasDislikedBefore: true,
          myLikeId: myDislikeOfThisPost[0].id,
        })
      }
    }
  }

  render() {
    const { postId } = this.props.match.params;
    const { isAuth, me } = this.props;

    return (
      <React.Fragment>
        <Query
          query={FIND_POST_QUERY}
          variables={{ id: postId }}
          fetchPolicy={"cache-and-network"}
          onCompleted={data => this.setLikeHistory(data.findPostById.likes)}>
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
                <Jumbotron style={{ padding: "2rem 3rem" }}>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <h4 className="display-6">{post.title}</h4>
                      <small>posted by {post.author.username}</small>
                    </div>{isAuth ?
                      <div>
                        {
                          post.author.username === me.username ?
                            <React.Fragment>
                              <ButtonToolbar>
                                <Button onClick={this.handleEditPost} className='mr-3'>edit</Button>
                                <Button onClick={this.handleDeletePost}>delete</Button>

                              </ButtonToolbar>
                            </React.Fragment>
                            : <div />
                        }
                      </div> : <div />
                    }
                  </div>
                  <hr className="my-1" />
                  <p></p>
                  <p className="lead">{nl2br(post.body)}</p>
                  <hr className="my-1" />
                  <p className="lead">
                    <svg className="like" style={{ fill: this.state.hasLikedBefore ? "green" : "dimgrey" }} version="1.1" width="50" height="24" viewBox="0 0 24 24" onClick={this.handleLike}>
                      <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z"></path>
                    </svg>
                    {likeNum}
                    <svg className="dislike" style={{ fill: this.state.hasDislikedBefore ? "red" : "dimgrey" }} version="1.1" width="50" height="24" viewBox="0 0 24 24" onClick={this.handleDislike}>
                      <path d="M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V13.91L1,14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z"></path>
                    </svg>
                    {dislikeNum}
                  </p>
                </Jumbotron>
                <div className='d-flex flex-column'>
                  {
                    isAuth ?
                      <>
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
                      </>
                      : <p>Please <a href="/Login">login</a> or <a href='/Register'>register </a>to share your thoughts!</p>
                  }


                </div>
                <div style={{ height: "243px" }}>
                  <CommentList comments={post.comments} />
                </div>
              </React.Fragment>
            )
          }}
        </Query>
        <Mutation mutation={DELETE_POST_MUTATION}>
          {deletePost => {
            this.deletePost = deletePost;
            return null;
          }}
        </Mutation>
        <Mutation mutation={CREATE_COMMENT_MUTATION}>
          {
            createComment => {
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

export default withAuthGuard(withRouter(Example));