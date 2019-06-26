import React, { Component } from 'react'
import { Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "../../containers/Navbar"
import CreatePost from '../../components/create-post-page'
import PostPage from '../../containers/PostPage'
import FrontPage from "../../components/front-page"
import Register from "../Register/Register"
import Profile from '../../components/Profile'
<<<<<<< HEAD
<<<<<<< HEAD
import postContent from '../Post-Content'
import Subs from '../../components/Subs'
import SubPage from '../../containers/SubPage'
import Logout from '../Logout/Logout'
import { BrowserHistory,Redirect, BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
//import { browserHistory, IndexRoute } from 'react-router';

=======
import PostContent from '../Post-Content'
import { Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";
>>>>>>> 1793d69163179db6bfb62d7a28f0080d0a5e0c8e
=======
import Subs from '../../components/Subs'
import SubPage from '../../containers/SubPage'
import Logout from '../Logout/Logout'
>>>>>>> 1911c9c83251dd48cd243c0c5e768ad9122b2241
import Login from '../Login/Login'
import PostContent from '../Post-Content'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'

class App extends Component {
  render() {
<<<<<<< HEAD
<<<<<<< HEAD
    const { authorList } = this.state;

    const authorMenu = authorList.map((author, id) => (
      <DropdownItem
        key={id}
        onClick={() => { this.handleDropdownSelect(author.name) }}>
        {author.name}
      </DropdownItem>
    ));
    console.log("app props",this.props)

=======
>>>>>>> 1793d69163179db6bfb62d7a28f0080d0a5e0c8e
=======
>>>>>>> 1911c9c83251dd48cd243c0c5e768ad9122b2241
    return (
      <Container>
        <Router>
          <div style={{ display: "flex" }}>
            <Subs style={{ background: "black", align: "left", float: "left" }}></Subs>
            <Navbar></Navbar>
          </div>

          <Row>
            <Col>
              <Switch>
                <Route path='/createPost' component={CreatePost} />
                <Route path='/frontPage' component={FrontPage} />
                <Route path='/login' component={Login} />
                <Route path='/logout' component={Logout} />
                <Route path='/register' component={Register} />
                <Route path='/myProfile' component={Profile} />
<<<<<<< HEAD
<<<<<<< HEAD
                <Route path='/sub/:id' name={":id"} component={SubPage} />
                
                <Redirect from="/" to='frontPage'/>

                
=======
                <Redirect from="/" to='frontPage' />

>>>>>>> 1793d69163179db6bfb62d7a28f0080d0a5e0c8e
=======
                <Route exact path='/sub/:subName' component={SubPage} />
                <Route path='/sub/:subName/:postId' component={PostContent} />
                <Redirect from="/" to='frontPage' />
>>>>>>> 1911c9c83251dd48cd243c0c5e768ad9122b2241
              </Switch>
            </Col>
          </Row>
        </Router>
      </Container>

    )
  }
}

export default App