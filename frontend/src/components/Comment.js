import React from 'react';
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'

import { DELETE_COMMENT_MUTATION } from '../lib/graphql'
import { Mutation, Subscription } from 'react-apollo'

class Comment extends React.Component {

    handleDeleteComment = () => {
        const commentId = this.props.id;

        this.deleteComment({
            variables: {
                id: commentId
            }
        })
    }

    render() {
        const { username, text, me, isAuth } = this.props;

        return (
            <React.Fragment>
                <div className='d-flex justify-content-between'>
                    <div>
                        {username}: {text}
                    </div>
                    {isAuth ?
                        <div>
                            {username === me.username ?
                                <div>
                                    <span className='mr-2'>edit</span>
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
            </React.Fragment>
        )
    }
}

export default withAuthGuard(Comment);