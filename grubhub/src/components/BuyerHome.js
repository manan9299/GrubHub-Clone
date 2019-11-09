import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class BuyerHome extends Component {

	constructor(){
		super();
		this.state = {
			dishName : "",
			toRestaurantList : null,
			submitMessage : ""
		}
	}

	findFood = (event) => {
		event.preventDefault();
		let dishName = this.state.dishName;

		let reqData = {
			dishName : dishName
		}

		axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubUserToken');

		axios.post("http://3.88.210.120:3001/setUserPref", reqData)
			.then( response => {

                if(response.status == 200){
					let status = response.data.status;
					
                    if (status == 200){
                        this.setState({
							toRestaurantList : <Redirect to='/filteredrestaurants' />
						});
                    } else {
                        this.setState({
							toRestaurantList : <Redirect to='/' />
						});
                    }
                } else {
                    this.setState({
						submitMessage : "Could not get a response from the server"
					});
                }
			});
	}

	dishChangeHandler = (event) => {
		this.setState({
			dishName : event.target.value
		})
	}
	
	render() {
		let redirectVar = null;
		if(!localStorage.getItem('grubhubUserToken')){
			redirectVar = <Redirect to= "/buyerlogin"/>
		}
        
        return(
            <div className="offset-sm-4 col-sm-3">
				{redirectVar}
				{this.state.toRestaurantList}
				<Form>
					<Form.Text>
						Who delivers in your City?
					</Form.Text>
					<Form.Group >
						<Form.Label>Enter a dish</Form.Label>
						<Form.Control onChange={this.dishChangeHandler} placeholder='Pizza, Tacos, etc.' className='form-group' type="text" />
					</Form.Group>
					<Form.Group>
						<Button onClick={this.findFood} variant="primary" block>
							Find Food
						</Button>
					</Form.Group>
				</Form>
			</div>
        );
        
	}
}

export default BuyerHome;
