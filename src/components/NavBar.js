import React, { Component } from 'react';

/* Methods */
import { logout } from '../store/actions/auth';
import { connect } from 'react-redux';

/* Components */
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Clock from './Clock';

/* Styles */
import '../css/NavBar.css';

/* Logo */
import CocaLogo from '../CocaLogo.svg';

class NavBar extends Component {

  handleLogout = e => {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    return (
      <Navbar color='light' light>
        <NavbarBrand>Cola Day</NavbarBrand>
        <img style={{height: '80%'}} alt='coca-logo' src={CocaLogo} />
        <Clock />
        <Nav navbar>
          <NavItem>
            <NavLink href='#' onClick={this.handleLogout}>Log out</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default connect(null, { logout })(NavBar);
