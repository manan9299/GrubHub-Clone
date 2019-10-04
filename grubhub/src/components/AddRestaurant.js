import React, {Component} from 'react';
import { Form, Button, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class AddRestaurant extends Component {
    
	render() {
		return(
			<div className="offset-sm-4 col-sm-3">
				<Form>
					<Form.Text>
					Add a new Restaurant
					</Form.Text>
					<Form.Group >
						<Form.Label>Restaurant Name</Form.Label>
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

export default AddRestaurant;