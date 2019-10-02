import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class BuyerLogin extends Component {

	constructor(props){
		super(props);

		this.state = {
			email : "",
			password : "",
			authFlag : false,
			authMessage : "",
			isEmailValid : false,
			isPasswordValid : false,
			redirectToHome : ""
		}
		this.emailChangeHandler = this.emailChangeHandler.bind(this);
		this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
		this.submitLogin = this.submitLogin.bind(this);
	}

	submitLogin = (event) => {
		event.preventDefault();
		let reqData = {
			email : this.state.email,
			password : this.state.password
		}
		// set withCredentials to true in order to send cookies with request
		axios.defaults.withCredentials = true;

		axios.post('http://localhost:3001/login', reqData)
			.then(response => {
				console.log("response is " + JSON.stringify(response));
				if (response.status == 200){
					let status = response.data.status;
					if (status == "200") {
						this.setState({
							authFlag : true,
							authMessage : "",
							redirectToHome : <Redirect to= "/buyerhome"/>
						});
					} else if (status == "403") {
						this.setState({
							authFlag : false,
							authMessage : "Invalid Credentials",
						});
					} else {
						this.setState({
							authFlag : false,
							authMessage : "Internal Server Error",
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

	emailChangeHandler = (event) => {
		let email = event.target.value;
		if (email != ""){
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

	render() {
		let redirectVar = null;
		if(cookie.load('grubhubcookie')){
			redirectVar = <Redirect to= "/buyerhome"/>
		}
		let {isEmailValid, isPasswordValid} = this.state;
		let emailErrorMessage = isEmailValid ? "" : "Email is Invalid";
		let passwordErrorMessage = isPasswordValid ? "" : "Password is Invalid";
		let authMessage = this.state.authFlag ? "" : this.state.authMessage;
		let redirectToHome = this.state.redirectToHome;

		return (
			<div className="offset-sm-4 col-sm-3">
			{redirectVar}
			{redirectToHome}
			<Form>
				<Form.Text>
				Sign In to your Grubhub Account
				</Form.Text>
				
				<Form.Group controlId="buyerEmailId">
					<Form.Label>Email address</Form.Label>
					<Form.Control type="email" onChange={this.emailChangeHandler} className='form-group' />
					{emailErrorMessage}
				</Form.Group>

				<Form.Group controlId="buyerPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control onChange={this.passwordChangeHandler} type="password" />
					{passwordErrorMessage}
					<br/>
					{authMessage}
				</Form.Group>
				<Form.Group>
					<Button onClick={this.submitLogin} variant="danger" type="submit" block>
						Sign In
					</Button>
				</Form.Group>
				<Form.Group>
					<Button variant="link" type="submit" href='buyersignup' block>
						Create an Account
					</Button>
				</Form.Group>
			</Form>
			</div>
		);
	}
}

export default BuyerLogin;
