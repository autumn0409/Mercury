import React, { Component } from 'react'
import { Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "../../containers/Navbar"
import CreatePost from '../../components/create-post-page'
import FrontPage from "../../components/front-page"
import Register from "../Register/Register"
import Profile from '../../components/Profile'
import Subs from '../../components/Subs'
import SubPage from '../../containers/SubPage'
import Logout from '../Logout/Logout'
import Login from '../Login/Login'
import PostContent from '../Post-Content'
import EditPost from '../../components/EditPost'
import MyPosts from '../MyPosts'
import FavoritePosts from '../FavoritePosts'
import Search from '../Search'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import 'react-perfect-scrollbar/dist/css/styles.css';

class App extends Component {
  render() {
    return (
      <Container style={{ width: "100%" }}>
        <Router>
          <div style={{ width: "100%", display: "flex" }}>
            <Subs style={{ background: "black", align: "left", float: "left" }}></Subs>
            <Navbar style={{ width: "100%" }}></Navbar>
          </div>

          <div>
            <Switch>
              <Route path='/createPost' component={CreatePost} />
              <Route path='/frontPage' component={FrontPage} />
              <Route path='/login' component={Login} />
              <Route path='/logout' component={Logout} />
              <Route path='/register' component={Register} />
              <Route path='/myProfile' component={Profile} />
              <Route exact path='/sub/:subName' component={SubPage} />
              <Route path="/myPosts" component={MyPosts} />
              <Route path='/favoritePosts' component={FavoritePosts} />
              <Route path='/sub/:subName/:postId' component={PostContent} />
              <Route path='/edit/:postId' component={EditPost} />
              <Route path='/search/:name' component={Search} />
              <Redirect from="/" to='frontPage' />
            </Switch>
          </div>
        </Router>
      </Container>

    )
  }
}

export default App