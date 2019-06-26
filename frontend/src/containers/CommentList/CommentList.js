import React from 'react';

import Comment from '../../components/Comment'
class CommentList extends React.Component {

    render() {
        const { comments } = this.props;

        const commentList = comments.map(comment => {
            return (
                <Comment
                    username={comment.author.username}
                    text={comment.text}
                    key={comment.id}
                    id={comment.id}
                />
            )
        })
        return commentList;
    }
}

export default CommentList;