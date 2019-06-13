import React, { Component } from 'react'

import { BrowserRouter as Router, Route, Link,Switch } from "react-router-dom";
import { Query, Mutation } from 'react-apollo'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

import {
  USERS_QUERY,
  CREATE_POST_MUTATION,
  POSTS_SUBSCRIPTION,
} from '../../graphql'

import Author from '../../components/Author'
import Navbar from "../../containers/Navbar"
import classes from './App.module.css'
import createPost from '../../components/create-post-page'
import postPage from '../../containers/PostPage'

let unsubscribe = null

class App extends Component {
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
        <Router>
        <Navbar></Navbar>
        <Row>
          <Col>
            <h1 className={classes.title}>Modern GraphQL Tutorial</h1>
          </Col>
        </Row>
        <Row>
          <Col>
              <Route path = '/posts/' component = {postPage}/>
              <Route path='/createPost' component = {createPost}/>
          </Col>
        </Row>
        </Router>
      </Container>
    )
  }
}

export default App
