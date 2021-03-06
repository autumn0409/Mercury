import React from 'react';
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'
import { ME_QUERY } from '../lib/graphql'
import SearchField from 'react-search-field';


import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import './Navbar.css'


class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      hover: false
    };

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }
  toggelHover() {
    this.setState({ hover: !this.state.hover })
    console.log("hover", this.state.hover)
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  render() {
    const { isAuth, history } = this.props;
    const hoverStyle = {
      curser: "pointer"
    }
    const style = {}
    if (this.state.hover) {

    }

    return (
      <div className="NavBarr" style={{ width: "100%" }}>
        <Navbar color="light" light expand="sm">

          <NavbarToggler onClick={this.toggle} />

          <NavbarBrand className='navbar-item' onMouseEnter={this.toggelHover.bind(this)} onClick={() => history.push("/frontPage")}>Reddit Clone</NavbarBrand>

          <SearchField onSearchClick={
            (e) => {
              console.log(e)
              const str = e
              history.push("/search/" + str)
            }
          } placeholder='Search posts' />

          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem className='navbar-item'>
                <NavLink onClick={() => {
                  if (!isAuth)
                    alert("Please login first.")
                  else
                    history.push("/createPost/")
                }}>Post Something!</NavLink>
              </NavItem>

              <UncontrolledDropdown nav inNavbar>

                <Query query={ME_QUERY}>
                  {({ loading, error, data, subscribeToMore }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <DropdownToggle nav caret>Login</DropdownToggle>;
                    const me = data.me;
                    return (
                      <DropdownToggle nav caret>{me.username}</DropdownToggle>
                    )
                  }}
                </Query>
                <DropdownMenu right>

                  {
                    isAuth ? (
                      <React.Fragment>
                        <DropdownItem>
                          <NavLink onClick={() => history.push("/myProfile")}>My Profile</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                          <NavLink onClick={() => history.push("/myPosts")}>My Posts</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                          <NavLink onClick={() => history.push("/favoritePosts")}>Favorites</NavLink>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                          <NavLink onClick={() => history.push('/logout')}>Logout</NavLink>
                        </DropdownItem>
                      </React.Fragment>
                    ) : (
                        <React.Fragment>
                          <DropdownItem>
                            <NavLink onClick={() => history.push("/login")}>Login</NavLink>
                          </DropdownItem>
                          <DropdownItem>
                            <NavLink onClick={() => history.push("/register")}>Register</NavLink>
                          </DropdownItem>
                        </React.Fragment>
                      )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withAuthGuard(withRouter(Navigation))