
import React, { Component } from 'react'

import Navbar from "../../containers/Navbar"
import CreatePost from '../../components/create-post-page'
import PostPage from '../../containers/PostPage'
import FrontPage from "../../components/front-page"
import Register from "../Register/Register"
import Profile from '../../components/Profile'
import PostContent from '../Post-Content'
import { Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from '../Login/Login'
import Logout from '../Logout/Logout'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'

class App extends Component {
  render() {
    return (
      <Container>
        <Router>
          <Navbar />
          <Row>
            <Col>
              <Switch>
                <Route path='/posts/:id' id={":id"} component={PostContent} />
                <Route path='/posts' component={PostPage} />
                <Route path='/createPost' component={CreatePost} />
                <Route path='/frontPage' component={FrontPage} />
                <Route path='/login' component={Login} />
                <Route path='/logout' component={Logout} />
                <Route path='/register' component={Register} />
                <Route path='/myProfile' component={Profile} />
                <Redirect from="/" to='frontPage' />

              </Switch>
            </Col>
          </Row>
        </Router>
      </Container>

    )
  }
}

export default App