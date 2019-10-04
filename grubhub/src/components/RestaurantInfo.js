import React, {Component} from 'react';
import { Form, Button, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class RestaurantInfo extends Component {

  	
	render() {
        let redirectVar = null;
        // Uncomment this
		// if(!cookie.load('grubhubcookie')){
		// 	redirectVar = <Redirect to= "/buyerlogin"/>
        // }

        return(
            // className="offset-sm-3 col-sm-8"
            <div >
                {redirectVar}
                <Table bordered>
                    
                    <tbody>
                        <tr>
                            <td style={{fontWeight : 'bold'}}>Name</td>
                            <td>Mark</td>
                        </tr>
                        <tr>
                            <td style={{fontWeight : 'bold'}}>Address</td>
                            <td>Jacob</td>
                        </tr>
                        <tr>
                            <td style={{fontWeight : 'bold'}}>City</td>
                            <td >Larry the Bird</td>
                        </tr>
                        <tr>
                            <td style={{fontWeight : 'bold'}}>ZIP</td>
                            <td >Larry the Bird</td>
                        </tr>
                        <tr>
                            <td style={{fontWeight : 'bold'}}>Contact</td>
                            <td >Larry the Bird</td>
                        </tr>
                    </tbody>
                </Table>
			</div>
        );
        
	}
}

export default RestaurantInfo;
