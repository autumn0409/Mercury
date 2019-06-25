import React from 'react';

class Comments extends React.Component {

    render() {
        const { comments } = this.props;

        const commentList = comments.map(comment => {
            return (
                <div>
                    {comment.author.username}: {comment.text}
                </div>
            )
        })

        return commentList;
    }
}

export default Comments;