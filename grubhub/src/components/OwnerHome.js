import React, {Component} from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class OwnerHome extends Component {

  	
	render() {
        let redirectVar = null;
		if(!localStorage.getItem('grubhubToken')){
			redirectVar = <Redirect to= "/ownerlogin"/>
		}

        return(
            <div className="offset-sm-3 col-sm-8">
                {redirectVar}
                <Form inline>
                    <Card style={{ width: '18rem', margin: '2rem'}} >
                        <Card.Body >
                            <Card.Title >Manage Orders</Card.Title>
                            <Card.Text>
                            You can view newly placed orders and manage their status here.
                            </Card.Text>
                            <Button variant="danger" href="/manageOrders" block>Manage</Button>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem', margin: '2rem'}} >
                        <Card.Body >
                            <Card.Title >View Past Orders</Card.Title>
                            <Card.Text>
                            Click here to view history of orders placed at your restaurant.
                            </Card.Text>
                            <Button variant="light" href="/ownerPastOrders" block>Past Orders</Button>
                        </Card.Body>
                    </Card>

                </Form>
				
			</div>
        );
        
	}
}

export default OwnerHome;
