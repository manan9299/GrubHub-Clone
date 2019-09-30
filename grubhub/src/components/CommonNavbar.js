import React, {Component} from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'

class CommonNavbar extends Component {

  render() {
    const btnStyle = {
      margin: '5px'
    }
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home" bsPrefix="mainNavBrand-logo">GRUBHUB</Navbar.Brand>
          <Form className="offset-sm-8" inline>
            <Button variant="danger"  style={btnStyle} href='/buyerlogin'>Login</Button>
            <Button variant="outline-danger"  style={btnStyle} href='buyersignup'>Sign Up</Button>
            <Button variant="light"  style={btnStyle} href='ownerlogin'>Partners</Button>
          </Form>
        </Navbar>
      </div>
    );
  }
}

export default CommonNavbar;
