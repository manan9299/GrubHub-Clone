import React, {Component} from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import cookie from 'react-cookies';

class CommonNavbar extends Component {
	constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('grubhubcookie', { path: '/' })
    }

	render() {
		let loginButtons = null;

		const btnStyle = {
			margin: '5px'
		}

		if (cookie.load("grubhubcookie")){
			console.log("Active Session detected !!");
			loginButtons = (
				<Form className="offset-sm-10" inline>
					<Button variant="light" onClick={this.handleLogout} href="/" style={btnStyle}>Logout</Button>
				</Form>
			);
		} else {
			console.log("No active sessions detected");
			loginButtons = (
				<Form className="offset-sm-8" inline>
					<Button variant="danger"  style={btnStyle} href='/buyerlogin'>Login</Button>
					<Button variant="outline-danger"  style={btnStyle} href='buyersignup'>Sign Up</Button>
					<Button variant="light"  style={btnStyle} href='ownerlogin'>Partners</Button>
				</Form>
			);
		}

		return (
			<div>
			<Navbar bg="light" expand="lg">
				<Navbar.Brand href="#home" bsPrefix="mainNavBrand-logo">GRUBHUB</Navbar.Brand>
				{loginButtons}
			</Navbar>
			</div>
		);
	}
}

export default CommonNavbar;
