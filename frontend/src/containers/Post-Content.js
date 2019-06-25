import React, { Component } from 'react';
import { Query } from 'react-apollo'
import { FIND_POST_QUERY, COMMENTS_SUBSCRIPTION, LIKES_SUBSCRIPTION } from '../lib/graphql'
import { Jumbotron, Button } from 'reactstrap'
import Comments from '../components/Comments'

let unsubscribeComments = null;
let unsubscribeLikes = null;


class Example extends Component {

  render() {
    const { id } = this.props.match.params;

    return (
      <Query
        query={FIND_POST_QUERY}
        variables={{ id: id }}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error :(((</p>

          const post = data.findPostById;

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
              <Comments comments={post.comments} />
            </React.Fragment>
          )
        }}
      </Query>

    );
  }

};

export default Example;