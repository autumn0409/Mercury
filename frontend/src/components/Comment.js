import React from 'react';
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'
import nl2br from 'react-newline-to-break';
import {
  EDIT_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
  CREATE_COMMENTVOTE_MUTATION,
  DELETE_COMMENTVOTE_MUTATION,
  COMMENTVOTES_SUBSCRIPTION,
} from '../lib/graphql'
import { Mutation, Subscription } from 'react-apollo'
import { Button,ButtonGroup,Input } from 'reactstrap';
class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.inputEl = null;
    this.state = {
      editInputToggled: false,
      editText: this.props.text,
      upVoteNum: 0,
      downVoteNum: 0,
      hasUpVotedBefore: false,
      hasDownVotedBefore: false,
      myVoteId: '',
    }
  };

  componentWillMount = () => {
    const { isAuth, me, commentVotes } = this.props;

    const upVoteCnt = commentVotes.filter(voteItem => {
      return voteItem.like === true;
    }).length;

    const downVoteCnt = commentVotes.filter(voteItem => {
      return voteItem.like === false;
    }).length;

    this.setState({
      upVoteNum: upVoteCnt,
      downVoteNum: downVoteCnt,
    })

    if (isAuth) {
      const myUpVoteForThisComment = commentVotes.filter(voteItem => {
        return (voteItem.user.username === me.username && voteItem.like === true)
      })

      const myDownVoteForThisComment = commentVotes.filter(voteItem => {
        return (voteItem.user.username === me.username && voteItem.like === false)
      })

      const hasUpVotedThisComment = (myUpVoteForThisComment.length > 0);
      const hasDownVotedThisComment = (myDownVoteForThisComment.length > 0);

      if (hasUpVotedThisComment) {
        this.setState({
          hasUpVotedBefore: true,
          myVoteId: myUpVoteForThisComment[0].id,
        })
      }
      else if (hasDownVotedThisComment) {
        this.setState({
          hasDownVotedBefore: true,
          myVoteId: myDownVoteForThisComment[0].id,
        })
      }
    }
  }

  handleDeleteComment = () => {
    const commentId = this.props.id;
    this.deleteComment({
      variables: {
        id: commentId
      }
    })
  }

  handleEditInputToggled = () => {
    this.setState({
      editInputToggled: !this.state.editInputToggled
    })
  }

  handleEditComment = () => {
    const commentId = this.props.id;
    this.editComment({
      variables: {
        id: commentId,
        text: this.state.editText
      }
    }).then(response => {
      this.setState({
        editInputToggled: false,
        editText: response.data.updateComment.text
      })
    })
  }

  handleCancelEditComment = () => {
    this.setState({
      editInputToggled: false,
      editText: this.props.text
    })
  }

  handleInputChange = (e) => {
    this.setState({
      editText: e.target.value
    })
  }

  updateVoteNum = (commentVote) => {

    const mutation = commentVote.mutation;
    const likeOrNot = commentVote.data.like;

    if (mutation === "CREATED") {
      if (likeOrNot === true) {
        this.setState({
          upVoteNum: this.state.upVoteNum + 1,
        })
      } else {
        this.setState({
          downVoteNum: this.state.downVoteNum + 1,
        })
      }
    }
    else {
      if (likeOrNot === true) {
        this.setState({
          upVoteNum: this.state.upVoteNum - 1,
        })
      } else {
        this.setState({
          downVoteNum: this.state.downVoteNum - 1,
        })
      }
    }
  }

  handleUpVote = () => {
    if (!this.props.isAuth)
      return;

    if (this.state.hasUpVotedBefore) {
      this.deleteCommentVote({
        variables: {
          id: this.state.myVoteId,
        }
      }).then(() => {
        this.setState({
          hasUpVotedBefore: false,
          myVoteId: '',
        })
      })
    } else if (this.state.hasDownVotedBefore) {
      this.deleteCommentVote({
        variables: {
          id: this.state.myVoteId,
        }
      }).then(() => {
        this.createCommentVote({
          variables: {
            comment: this.props.id,
            like: true,
          }
        }).then((res => {
          this.setState({
            hasUpVotedBefore: true,
            hasDownVotedBefore: false,
            myVoteId: res.data.createCommentVote.id,
          })
        }))
      })
    } else {
      this.createCommentVote({
        variables: {
          comment: this.props.id,
          like: true,
        }
      }).then((res => {
        this.setState({
          hasUpVotedBefore: true,
          hasDownVotedBefore: false,
          myVoteId: res.data.createCommentVote.id,
        })
      }))
    }
  }

  handleDownVote = () => {
    if (!this.props.isAuth)
      return;

    if (this.state.hasDownVotedBefore) {
      this.deleteCommentVote({
        variables: {
          id: this.state.myVoteId,
        }
      }).then(() => {
        this.setState({
          hasDownVotedBefore: false,
          myVoteId: ''
        })
      })
    } else if (this.state.hasUpVotedBefore) {
      this.deleteCommentVote({
        variables: {
          id: this.state.myVoteId,
        }
      }).then(() => {
        this.createCommentVote({
          variables: {
            comment: this.props.id,
            like: false,
          }
        }).then((res => {
          this.setState({
            hasUpVotedBefore: false,
            hasDownVotedBefore: true,
            myVoteId: res.data.createCommentVote.id,
          })
        }))
      })
    } else {
      this.createCommentVote({
        variables: {
          comment: this.props.id,
          like: false,
        }
      }).then((res => {
        this.setState({
          hasUpVotedBefore: false,
          hasDownVotedBefore: true,
          myVoteId: res.data.createCommentVote.id,
        })
      }))
    }
  }

  render() {
    const { username, text, me, isAuth, id } = this.props;

    return (
      <React.Fragment>
        <div className='d-flex justify-content-between' style={{padding:"30px"}}>
          <div className='d-flex'>
              <div style={{display:"flex",flexDirection:"column",padding:"5px"}}>
                <div>
                  <svg className="like" onClick={this.handleUpVote} style={{fill:this.state.hasUpVotedBefore ? "green" : "dimgrey"}} version="1.1" width="50" height="24" viewBox="0 0 24 24" >
                  <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z"></path>
                  </svg>
                  {this.state.upVoteNum}
                </div>
                <div>
                  <svg className="dislike" onClick={this.handleDownVote} style={{fill:this.state.hasDownVotedBefore ? "red" : "dimgrey"}} version="1.1" width="50" height="24" viewBox="0 0 24 24">
                    <path d="M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V13.91L1,14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z"></path>
                  </svg>
                  {this.state.downVoteNum}
                </div>
              </div>
            <div style={{padding:"3px 20px"}}>
              <small>{username}:<br/></small> {this.state.editInputToggled ?
                <React.Fragment>
                  <Input
                    type='textarea'
                    defaultValue={text}
                    innerRef={el => { this.inputEl = el }}
                    onChange={this.handleInputChange}
                  />
                  <div className='add-or-cancel'>
                    <button type="button" className="btn btn-info btn-sm mb-0 mt-2" onClick={this.handleEditComment}>Edit</button>
                    <button type="button" className="btn btn-info btn-sm mb-0 ml-1 mt-2" onClick={this.handleCancelEditComment}>Cancel</button>
                  </div>
                </React.Fragment> : nl2br(text)}
            </div>
          </div>
          {isAuth ?
            <div>
              {username === me.username ?
                <div style={{margin:"23%",display:"flex"}} >
                  <ButtonGroup>
                  <Button color="primary" className='mr-2' style={{width: '50px' ,padding:"3px"}} onClick={this.handleEditInputToggled}><small>edit</small></Button>
                  <Button color="primary" style={{width: '60px',padding:"3px"}} onClick={this.handleDeleteComment}><small>delete</small></Button>
                  </ButtonGroup>
                </div> :
                <div />
              }
            </div> :
            <div />
          }
        </div>
        <Mutation mutation={DELETE_COMMENT_MUTATION}>
          {deleteComment => {
            this.deleteComment = deleteComment;
            return null;
          }}
        </Mutation>
        <Mutation mutation={EDIT_COMMENT_MUTATION}>
          {editComment => {
            this.editComment = editComment;
            return null;
          }}
        </Mutation>
        <Mutation mutation={CREATE_COMMENTVOTE_MUTATION}>
          {createCommentVote => {
            this.createCommentVote = createCommentVote;
            return null;
          }}
        </Mutation>
        <Mutation mutation={DELETE_COMMENTVOTE_MUTATION}>
          {deleteCommentVote => {
            this.deleteCommentVote = deleteCommentVote;
            return null;
          }}
        </Mutation>
        <Subscription
          subscription={COMMENTVOTES_SUBSCRIPTION}
          variables={{ commentId: id }}
          onSubscriptionData={({ subscriptionData }) => this.updateVoteNum(subscriptionData.data.commentVote)}>
        </Subscription>
      </React.Fragment>
    )
  }
}

export default withAuthGuard(Comment);