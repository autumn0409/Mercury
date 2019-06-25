
import React, { Component } from 'react'

import Navbar from "../../containers/Navbar"
import CreatePost from '../../components/create-post-page'
import PostPage from '../../containers/PostPage'
import FrontPage from "../../components/front-page"
import Register from "../Register/Register"
import Profile from '../../components/Profile'
import { Redirect, BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Login from '../Login/Login'
import Logout from '../Logout/Logout'

/*
import {
  USERS_QUERY,
  CREATE_POST_MUTATION,
  POSTS_SUBSCRIPTION,
} from '../../lib/graphql'
*/
//import { Redirect, BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
//import { Query, Mutation } from 'react-apollo'
import {
  Container,
  Row,
  Col,
  DropdownItem
} from 'reactstrap'

//let unsubscribe = null

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      formTitle: '',
      formBody: '',
      dropdownOpen: false,
      dropdownAuthor: '',
      authorList: []
    };
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

      <Container>
        <Router>
          <Navbar />
          <Row>
            <Col>
              <Switch>
                <Route path='/posts' component={PostPage} />
                <Route path='/createPost' component={CreatePost} />
                <Route path='/frontPage' component={FrontPage} />
                <Route path='/login' component={Login} />
                <Route path='/logout' component={Logout} />
                <Route path='/register' component={Register} />
                <Route path='/myProfile' component={Profile} />

              </Switch>
            </Col>
          </Row>
        </Router>
      </Container>

    )
  }
}

export default App