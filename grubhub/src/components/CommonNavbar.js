import React, {Component} from 'react';
import { Navbar } from 'react-bootstrap'

class CommonNavbar extends Component {
  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home" bsPrefix="mainNavBrand-logo">GRUBHUB</Navbar.Brand>
        </Navbar>
      </div>
    );
  }
}

export default CommonNavbar;
