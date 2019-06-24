import React from 'react';
import withAuthGuard from '../hoc/AuthGuard/AuthGuard'
//'../../hoc/AuthGuard/AuthGuard'

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
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/frontPage">Reddit Clone</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/createPost/">Post Something!</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/posts/">What's new?</NavLink>
              </NavItem>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Settings
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                      <NavLink href="/register">Register</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                      <NavLink href="/login">Login</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavItem>
                      <NavLink href="/myProfile">My Profile</NavLink>
                    </NavItem>
                  </DropdownItem>
                  <DropdownItem>
                    My Posts
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Favorites
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withAuthGuard(Navigation)