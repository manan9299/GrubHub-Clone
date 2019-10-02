import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class OwnerHome extends Component {

  	
	render() {
        return(
            <div className="offset-sm-4 col-sm-3">
				<Form>
					<Form.Text>
					    Owner's Home Page
					</Form.Text>
				</Form>
			</div>
        );
        
	}
}

export default OwnerHome;
