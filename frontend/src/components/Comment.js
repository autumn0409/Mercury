import React from 'react';

class Comment extends React.Component {

    render() {
        const { username, text } = this.props;

        return (
            <div>
                {username}: {text}
            </div>
        )
    }
}

export default Comment;