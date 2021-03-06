import React from 'react';
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'
import { NavLink } from 'react-router-dom'
import { Mutation, Subscription } from 'react-apollo'
import { LIKES_SUBSCRIPTION, CREATE_LIKE_MUTATION, DELETE_LIKE_MUTATION } from '../lib/graphql'

import './Post.css';

class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      likeNum: 0,
      dislikeNum: 0,
      hasLikedBefore: false,
      hasDislikedBefore: false,
      myLikeId: '',
    };
  }

  componentWillMount = () => {
    const { isAuth, me } = this.props;
    const postLikes = this.props.likes;

    const likeCnt = postLikes.filter(likeItem => {
      return likeItem.like === true;
    }).length;

    const dislikeCnt = postLikes.filter(likeItem => {
      return likeItem.like === false;
    }).length;

    this.setState({
      likeNum: likeCnt,
      dislikeNum: dislikeCnt,
    })

    if (isAuth) {
      const myLikeOfThisPost = postLikes.filter(likeItem => {
        return (likeItem.user.username === me.username && likeItem.like === true)
      })

      const myDislikeOfThisPost = postLikes.filter(likeItem => {
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

  updateLikeNum = (like) => {
    const mutation = like.mutation;
    const likeOrNot = like.data.like;

    if (mutation === "CREATED") {
      if (likeOrNot === true) {
        this.setState({
          likeNum: this.state.likeNum + 1,
        })
      } else {
        this.setState({
          dislikeNum: this.state.dislikeNum + 1,
        })
      }
    }
    else {
      if (likeOrNot === true) {
        this.setState({
          likeNum: this.state.likeNum - 1,
        })
      } else {
        this.setState({
          dislikeNum: this.state.dislikeNum - 1,
        })
      }
    }
  }


  handleLike = () => {
    if (!this.props.isAuth)
      return;

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
            post: this.props.id,
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
          post: this.props.id,
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
            post: this.props.id,
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
          post: this.props.id,
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

  render() {
    const { id, title, body, author, subName } = this.props;
    const username = author.username;

    return (
      <div>
        <div className="list-group-item list-group-item-action" style={{ width: "100%" }}>
          <div>
            <NavLink className=" list-group-item-action" to={"/sub/" + subName + "/" + id}>
              <h5 className="mb-1">{title}</h5>
            </NavLink>

            <small className="text-muted">posted by {username}</small>
          </div>
          <small className="mb-1">{body}</small>
          <small className="text-muted">
            <div>
              <svg onClick={this.handleLike} style={{fill:this.state.hasLikedBefore ? "green" : "dimgrey"}} className="like" version="1.1" width="50" height="24" viewBox="0 0 24 24" >
                <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z"></path>
              </svg>
              {this.state.likeNum}
              <svg onClick={this.handleDislike} style={{fill:this.state.hasDislikedBefore ? "red" : "dimgrey"}} className="dislike" version="1.1" width="50" height="24" viewBox="0 0 24 24">
                <path d="M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V13.91L1,14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z"></path>
              </svg>
              {this.state.dislikeNum}
            </div>
          </small>

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
          <Subscription
            subscription={LIKES_SUBSCRIPTION}
            variables={{ postId: id }}
            onSubscriptionData={({ subscriptionData }) => this.updateLikeNum(subscriptionData.data.like)}>
          </Subscription>
        </div>
      </div>
    )
  }
}

export default withAuthGuard(Post)
