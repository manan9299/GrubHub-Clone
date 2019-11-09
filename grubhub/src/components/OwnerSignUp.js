import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap'
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class OwnerSignUp extends Component {

	constructor(props){
		super(props);

		this.state = {
			email : "",
			password : "",
			ownerName : "",
			contact : "",
			authFlag : false,
			authMessage : "",
			isEmailValid : false,
			isPasswordValid : false
		}
		this.emailChangeHandler = this.emailChangeHandler.bind(this);
		this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
		this.contactChangeHandler = this.contactChangeHandler.bind(this);
		this.nameChangeHandler = this.nameChangeHandler.bind(this);
		this.submitSignUp = this.submitSignUp.bind(this);
	}

	submitSignUp = (event) => {
		event.preventDefault();
		let reqData = {
			email : this.state.email,
			password : this.state.password,
			ownerName : this.state.ownerName,
			contact : this.state.contact
		}

		// set withCredentials to true in order to send cookies with request
		axios.defaults.withCredentials = true;

		axios.post('http://3.88.210.120:3001/ownersignup', reqData)
			.then(response => {
				
				if (response.status == 200){
					let status = response.data.status;
					if (status == "200") {
						this.setState({
							authFlag : true,
							authMessage : "Signed Up Successfully, Login to Continue"
						});
					} else if (status == "403") {
						this.setState({
							authFlag : false,
							authMessage : "Invalid Credentials",
						});
					} else {
						this.setState({
							authFlag : false,
							authMessage : "Email already used by another user",
						});
					}
				} else {
					this.setState({
						authFlag : false,
						authMessage : "Error while fetching Data from Backend"
					})
				}
			})
	}

	nameChangeHandler = (event) => {
		this.setState({
			ownerName : event.target.value
		});
	}

	emailChangeHandler = (event) => {
		let email = event.target.value;
		let emailRegex = new RegExp(".+@.+\..+");
		if (email != "" && emailRegex.test(email)){
			this.setState({
				email : email,
				isEmailValid : true
			});
		} else {
			this.setState({
				isEmailValid : false
			});
		}
	}

	passwordChangeHandler = (event) => {
		let password = event.target.value;
		if (password != ""){
			this.setState({
			password : password,
			isPasswordValid : true
			});
		} else {
			this.setState({
			isPasswordValid : false
			});
		}
	}

	contactChangeHandler = (event) => {
		this.setState({
			contact : event.target.value
		});
	}


	render() {
		let redirectVar = null;
		if(cookie.load('grubhubcookie')){
			redirectVar = <Redirect to= "/ownerhome"/>
		}
		let {isEmailValid, isPasswordValid} = this.state;
		let emailErrorMessage = isEmailValid ? "" : "Email is Invalid";
		let passwordErrorMessage = isPasswordValid ? "" : "Password is Invalid";

		return (
			<div className="offset-sm-4 col-sm-3">
				{redirectVar}
				<Form>
					<Form.Text>
					Create Your Account
					</Form.Text>
					<Form.Group >
						<Form.Label>Name</Form.Label>
						<Form.Control onChange={this.nameChangeHandler} className='form-group' type="text" />
					</Form.Group>
					<Form.Group >
						<Form.Label>Email</Form.Label>
						<Form.Control onChange={this.emailChangeHandler} className='form-group' />
						{emailErrorMessage}
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control onChange={this.passwordChangeHandler} type="password" />
						{passwordErrorMessage}
					</Form.Group>
					<Form.Group>
						<Form.Label>Contact</Form.Label>
						<Form.Control onChange={this.contactChangeHandler} type="text" />
						
					</Form.Group>
						<Form.Group>
						<Button onClick={this.submitSignUp} variant="primary" type="submit" block>
							Create your Account
						</Button>
						<br/>
						{this.state.authMessage}
					</Form.Group>
				</Form>
			</div>
		);
	}
}

export default OwnerSignUp;
