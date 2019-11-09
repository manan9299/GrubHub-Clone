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
		localStorage.removeItem('grubhubToken');
        // cookie.remove('grubhubcookie', { path: '/' })
	}
	
	handleUserLogout = () => {
		localStorage.removeItem('grubhubUserToken');
	}

	render() {
		let navBarButtons = null;

		const btnStyle = {
			margin: '5px'
		}

		if (localStorage.getItem('grubhubToken')){
			console.log("Active Session detected !!");
			navBarButtons = (
				// className="offset-sm-10"
				<Form className="offset-sm-8" inline>
					<Button variant="link"  style={btnStyle} href='/ownerhome'>Home</Button>
					<NavDropdown title="Manage Account" id="nav-dropdown">
						<NavDropdown.Item href='/restaurantinfo'>Update Restaurant Info</NavDropdown.Item>
						<NavDropdown.Item href='/addsection'>Add Sections</NavDropdown.Item>
						<NavDropdown.Item href='/additem'>Add Menu Items</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item >View Profile</NavDropdown.Item>
						<NavDropdown.Item onClick={this.handleLogout} href="/">Logout</NavDropdown.Item>
					</NavDropdown>
				</Form>
			);
		} else if (localStorage.getItem('grubhubUserToken')){
			console.log("Active Session detected !!");
			navBarButtons = (
				// className="offset-sm-10"
				<Form className="offset-sm-8" inline>
					<Button variant="link"  style={btnStyle} href='/buyerhome'>Home</Button>
					<NavDropdown title="Manage Account" id="nav-dropdown">
						<NavDropdown.Item href='/upcomingOrders'>View Upcoming Orders</NavDropdown.Item>
						<NavDropdown.Item href='/buyerPastOrders'>View Past Orders</NavDropdown.Item>
						<NavDropdown.Item href='/viewcart'>Cart</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item >View Profile</NavDropdown.Item>
						<NavDropdown.Item onClick={this.handleUserLogout} href="/">Logout</NavDropdown.Item>
					</NavDropdown>
				</Form>
			);

		} else {
			console.log("No active sessions detected");
			navBarButtons = (
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
				{navBarButtons}
			</Navbar>
			</div>
		);
	}
}

export default CommonNavbar;
