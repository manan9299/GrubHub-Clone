import React, {Component} from 'react';
import { Form, Button, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class RestaurantInfo extends Component {

    constructor(){
        super();
        this.state = {
            restaurantId : "",
            name : "",
            address : "",
            city : "",
            zip : "",
            contact : "",
            updateMessage : "",
            infoNotFound : false
        }
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubToken');

        axios.get("http://3.88.210.120:3001/getRestaurantInfo")
            .then(response => {
                console.log("Response is : " + JSON.stringify(response, null, 4));
                let {status, payload} = response.data;
                
                if (status == 200){
                    this.setState({
                        restaurantId : payload["restaurantId"],
                        name : payload["name"],
                        address : payload["address"],
                        city : payload["city"],
                        zip : payload["zip"],
                        contact : payload["contact"]
                    });
                } else if (status == 404){
                    this.setState({
                        infoNotFound : true
                    });

                }
            });
    }

    submitUpdate = () => {
        let {name, address, city, zip, contact} = this.state;
        
        let reqData = {
            name : name,
            address : address,
            city : city,
            zip : zip,
            contact : contact
        }

        axios.post("http://3.88.210.120:3001/updateRestaurant", reqData)
            .then( response => {
                console.log("Response is : " + JSON.stringify(response));

                if(response.status == 200){
                    let status = response.data.status;
                    if (status == 200){
                        this.setState({
                            updateMessage : "Restaurant Info updated successfully",
                            infoNotFound : false
                        });
                    } else {
                        this.setState({
                            updateMessage : "Failed to update restaurant Info"
                        });
                    }
                } else {
                    this.setState({
                        updateMessage : "Failed to update restaurant Info"
                    });
                }
            });


    }

    getTableContents = () => {
        
        let { name, address, city, contact, zip} = this.state;
        let tableData = (
            <tbody>
                {/* <tr>
                    <td style={{fontWeight : 'bold', width: '50%'}}>Name</td>
                    <td>{restaurantInfo["Name"]}</td>
                </tr> */}
                <tr>
                    <td style={{fontWeight : 'bold', width: '50%'}}>Name</td>
                    <td>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" defaultValue={name}
                                onChange={(e) => this.setState({
                                    name : e.target.value
                                }) }
                            />
                        </Form.Group>
                    </td>
                </tr>
                
                <tr>
                    <td style={{fontWeight : 'bold'}}>Address</td>
                    <td>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" defaultValue={address}
                                onChange={(e) => this.setState({
                                    address : e.target.value
                                }) }
                            />
                        </Form.Group>
                    </td>
                </tr>
                <tr>
                    <td style={{fontWeight : 'bold'}}>City</td>
                    <td >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" defaultValue={city}
                                onChange={(e) => this.setState({
                                    city : e.target.value
                                }) }
                            />
                        </Form.Group>
                    
                    </td>
                </tr>
                <tr>
                    <td style={{fontWeight : 'bold'}}>ZIP</td>
                    <td >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" defaultValue={zip}
                                onChange={(e) => {this.setState({
                                    zip : e.target.value
                                })} }
                            />
                        </Form.Group>
                    </td>
                </tr>
                <tr>
                    <td style={{fontWeight : 'bold'}}>Contact</td>
                    <td >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" defaultValue={contact}
                                onChange={(e) => this.setState({
                                    contact : e.target.value
                                }) }
                            />
                        </Form.Group>
                    </td>
                </tr>
                <tr>
                    <td colSpan='2'>
                        <Button onClick={this.submitUpdate} variant="primary" type="submit" block>
                            Update Restaurant Info
                        </Button>
                    </td>

                </tr>
            </tbody>
            
        );
        return tableData;
    }

  	
	render() {
        let redirectVar = null;
		if(!localStorage.getItem('grubhubToken')){
			redirectVar = <Redirect to= "/ownerlogin"/>
		}

        let tableData = this.getTableContents();

        return(
            // className="offset-sm-3 col-sm-8"
            <div >
                {redirectVar}
                
                <Table className="offset-sm-3" style={{width: '50%', marginTop: '2rem'}}>
                <thead>
                    <tr>
                        <th colSpan='2' style={{fontWeight: 'bold', fontSize: '30px'}}>Restaurant Info :</th>
                    </tr>
                </thead>
                    {tableData}
                    {this.state.updateMessage}
                </Table>
			</div>
        );
        
	}
}

export default RestaurantInfo;
