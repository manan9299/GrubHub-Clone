import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class BuyerHome extends Component {

  	
	render() {
        let redirectVar = null;
		if(!cookie.load('grubhubcookie')){
			redirectVar = <Redirect to= "/buyerlogin"/>
        }
        
        return(
            <div className="offset-sm-4 col-sm-3">
                {redirectVar}
				<Form>
					<Form.Text>
					    Buyer's Home Page
					</Form.Text>
				</Form>
			</div>
        );
        
	}
}

export default BuyerHome;
