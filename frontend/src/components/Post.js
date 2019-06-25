import React from 'react';
import { Mutation, Subscription } from 'react-apollo'
import { LIKES_SUBSCRIPTION, CREATE_LIKE_MUTATION } from '../lib/graphql'

import './Post.css';

const ME = "8fd7c19a-98ae-4d3a-aac1-d26b417a665e"; // Andrew
class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id:"",
      likeNum: 0,
    };
  }

  componentDidMount = () => {
  
  console.log(this.props.data.likes.length)
      this.setState({
      likeNum: this.props.data.likes.length,
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
  }
  handleDislike = () =>{
    this.setState({
      likeNum: this.state.likeNum - 1
    })

    this.createLike({
      variables: {
        user: ME,
        post: this.props.id,
      }
    });
  }
  /*
  routeChange = () =>{
    let path = `newPath`;
    this.props.history.push(path);
  }*/

  render() {
    console.log("my id",this.props)
    
    const { id, title, body } = this.props.data;
    const username = this.props.data.author.username
    return (
      <div>
        <div class="list-group-item list-group-item-action" style={{width:"210%"}}>
          <div >
            <a class=" list-group-item-action" href = {id}>  
            <h5 class="mb-1">{title}</h5>
            </a>
          
            <small class="text-muted">posted by {username}</small>
          </div>
          <small class="mb-1">{body}</small>
          <small class="text-muted">

          <Mutation mutation={CREATE_LIKE_MUTATION}>
            {createLike => {
              this.createLike = createLike;

              return (
                <div>
                   <svg  onClick={this.handleLike} className = "like"  version = "1.1" width= "50" height= "24" viewBox = "0 0 24 24" >
                      <path d = "M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z"></path>
                  </svg>
                  {this.state.likeNum}
                  <svg onClick={this.handleDislike} className = "dislike" version = "1.1" width= "50" height= "24" viewBox = "0 0 24 24">
                      <path d = "M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V13.91L1,14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z"></path>
                  </svg>
                </div>
               
              )
            }}
          </Mutation>
          </small>

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

export default Post
