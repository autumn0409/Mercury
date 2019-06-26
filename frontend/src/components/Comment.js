import React from 'react';
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'

import { EDIT_COMMENT_MUTATION, DELETE_COMMENT_MUTATION } from '../lib/graphql'
import { Mutation } from 'react-apollo'
import { Input } from 'reactstrap';

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.inputEl = null;
        this.state = {
            editInputToggled: false,
            editText: this.props.text
        }
    };

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

    render() {
        const { username, text, me, isAuth } = this.props;

        return (
            <React.Fragment>
                <div className='d-flex justify-content-between'>
                    <div>
                        {username}: {this.state.editInputToggled ?
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
                            </React.Fragment> : text}
                    </div>
                    {isAuth ?
                        <div>
                            {username === me.username ?
                                <div>
                                    <span className='mr-2' onClick={this.handleEditInputToggled}>edit</span>
                                    <span onClick={this.handleDeleteComment}>delete</span>
                                </div> : <div />}
                        </div> : <div />}
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
            </React.Fragment>
        )
    }
}

export default withAuthGuard(Comment);