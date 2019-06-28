import React from 'react';
import { withRouter } from 'react-router-dom'
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'
import Subs from '../components/Subs'
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


class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
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

    return (
      <div>
        <Navbar color="light" light expand="md">

          <NavbarToggler onClick={this.toggle} />

          <NavbarBrand onClick={() => history.push("/frontPage")}>Reddit Clone</NavbarBrand>

          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={() => {
                  if (!isAuth)
                    alert("Please login first.")
                  else
                    history.push("/createPost/")
                }}>Post Something!</NavLink>
              </NavItem>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Settings
                </DropdownToggle>
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