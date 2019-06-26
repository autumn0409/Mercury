import React, { Component } from 'react'
import { Query } from 'react-apollo'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import {
  SUBS_QUERY,
  POSTS_SUBSCRIPTION,
} from '../lib/graphql'

import Post from '../components/Post'

let unsubscribe = null

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
    return (
      <Container  >
        <Row>
          <Col xs="6">
            <Query query={SUBS_QUERY} fetchPolicy={"cache-and-network"}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>

                const subName = this.props.match.params.subName;
                let sub_object;
                data.subs.map(sub => {
                  console.log(sub.name, subName)
                  if (sub.name === subName)
                    sub_object = sub
                  return null;
                })

                console.log(sub_object)
                const posts = sub_object.posts.map((post, id) => (
                  <Post {...post} subName={subName} key={id} />
                ))
                if (!unsubscribe)
                  unsubscribe = subscribeToMore({
                    document: POSTS_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      const newPost = subscriptionData.data.post.data

                      return {
                        ...prev,
                        posts: [newPost, ...prev.posts]
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
