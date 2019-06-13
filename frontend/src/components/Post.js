import React from 'react';
import { Mutation, Subscription } from 'react-apollo'
import { LIKES_SUBSCRIPTION, CREATE_LIKE_MUTATION } from '../graphql'

import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
} from 'reactstrap'

import './Post.css';

const ME = "8fd7c19a-98ae-4d3a-aac1-d26b417a665e"; // Andrew
class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      likeNum: 0,
    };
  }

  componentDidMount = () => {
    this.setState({
      likeNum: this.props.likes.length,
    })
  }

  updateLikeNum = (like) => {

    const mutation = like.mutation;
    const userId = like.data.user.id;

    if (userId !== ME) {
      if (mutation === "CREATED") {
        this.setState({
          likeNum: this.state.likeNum + 1,
        })
      }
      else {
        this.setState({
          likeNum: this.state.likeNum - 1,
        })
      }
    }
  }

  handleLike = () => {
    this.setState({
      likeNum: this.state.likeNum + 1,
    });

    this.createLike({
      variables: {
        user: ME,
        post: this.props.id,
      }
    });
  }

  render() {
    const { id, title, body } = this.props;

    return (
      <Card>
        <CardHeader>Title: {title}</CardHeader>
        <CardBody>
          {body || <p style={{ opacity: 0.5 }}>No body for this post...</p>}
        </CardBody>
        <CardFooter className='d-flex justify-content-between likes'>
          <div>{`Likes: ${this.state.likeNum}`}</div>
          <Mutation mutation={CREATE_LIKE_MUTATION}>
            {createLike => {
              this.createLike = createLike;

              return (
                <i className="fas fa-plus" onClick={this.handleLike}></i>
              )
            }}
          </Mutation>
        </CardFooter>
        <Subscription
          subscription={LIKES_SUBSCRIPTION}
          variables={{ postId: id }}
          onSubscriptionData={({ subscriptionData }) => this.updateLikeNum(subscriptionData.data.like)}>
        </Subscription>
      </Card>
    )
  }
}

export default Post
