import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import {
  Container,
  Row,
  Col,
  DropdownItem,
  ListGroup
} from 'reactstrap'

import {
  POSTS_QUERY,
  SUBS_QUERY,
  POSTS_SUBSCRIPTION,
} from '../lib/graphql'

import Post from '../components/Post'
import Author from '../components/Author'
import Navbar from "../containers/Navbar"
import classes from '../containers/App/App.module.css'

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
    const { authorList } = this.state;

    const authorMenu = authorList.map((author, id) => (
      <DropdownItem
        key={id}
        onClick={() => { this.handleDropdownSelect(author.name) }}>
        {author.name}
      </DropdownItem>
    ));

    return (
      <Container  >

        <Row>
          <Col xs="6">
            <Query query={SUBS_QUERY}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>

                const subName = this.props.match.params.id;
                let sub_object;
                data.subs.map(sub=>{
                  console.log(sub.name, subName)
                  if(sub.name == subName)
                  sub_object = sub 
    
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
