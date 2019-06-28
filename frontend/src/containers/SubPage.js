import React, { Component } from 'react'
import { Query } from 'react-apollo'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import {
  SUB_QUERY,
  POSTS_SUBSCRIPTION
} from '../lib/graphql'

import Post from '../components/Post'

let unsubscribePosts = null

class SubPage extends Component {
  state = {
    formTitle: '',
    formBody: '',
    dropdownOpen: false,
    dropdownAuthor: '',
    authorList: []
  }

  setUsers = (users) => {
    this.setState({
      authorList: users.map(user => ({
        id: user.id,
        name: user.name,
      }))
    });
  }

  nameToId = (name) => {
    const targetAuthor = this.state.authorList.find(author => {
      return author.name === name;
    });

    return targetAuthor.id;
  }

  handleFormSubmit = e => {
    e.preventDefault()

    const { formTitle, formBody, dropdownAuthor } = this.state

    if (!formTitle || !formBody || !dropdownAuthor) return

    this.createPost({
      variables: {
        title: formTitle,
        body: formBody,
        published: true,
        authorId: this.nameToId(dropdownAuthor),
      }
    })

    this.setState({
      formTitle: '',
      formBody: ''
    })
  }

  handleDropdownToggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleDropdownSelect = (authorName) => {
    this.setState({
      dropdownAuthor: authorName,
      dropdownOpen: false,
    });
  }

  render() {
    const subName = this.props.match.params.subName;

    return (
      <Container  >
        <Row>
          <Col xs="6">
            <Query query={SUB_QUERY} fetchPolicy={"cache-and-network"} variables={{ query: subName }}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>

                const sub_object = data.sub;

                const posts = sub_object.posts.map((post, id) => (
                  <Post {...post} subName={subName} key={id} />
                ))

                if (!unsubscribePosts)
                  unsubscribePosts = subscribeToMore({
                    document: POSTS_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;

                      const { mutation, data } = subscriptionData.data.post;
                      const originalSubData = prev.sub;

                      if (data.sub.name !== subName) return prev;

                      if (mutation === "CREATED") {
                        const newPost = data;

                        return {
                          sub: {
                            ...originalSubData,
                            posts: [...originalSubData.posts, newPost],
                          }
                        }
                      }
                      else if (mutation === "UPDATED") {
                        const updatedPost = data;
                        const oldPost = originalSubData.posts.find(post => post.id === updatedPost.id);
                        const oldPostIndex = originalSubData.posts.indexOf(oldPost);
                        const updatedPosts = originalSubData.posts.map((post, index) => {
                          if (index === oldPostIndex)
                            return updatedPost;
                          else
                            return post;
                        })

                        return {
                          sub: {
                            ...originalSubData,
                            posts: updatedPosts,
                          }
                        }
                      }
                      else {
                        const deletedPost = data;
                        const updatedPosts = originalSubData.posts.filter(post => {
                          return post.id !== deletedPost.id;
                        });

                        return {
                          sub: {
                            ...originalSubData,
                            posts: updatedPosts,
                          }
                        }
                      }
                    }
                  })
                return (<ul className="list-group list-group-flush" style={{ width: "100%" }}>
                  {posts}
                </ul>)
                // return <ListGroup>{posts}</ListGroup>
              }}
            </Query>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default SubPage
