import React, {Component} from 'react';
import {Dropdown, DropdownButton, Button, Table, Card, Pagination } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class OwnerPastOrders extends Component {

    constructor(){
        super();
        this.state = {
            orderList : []
        }
    }

    componentDidMount(){

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubToken');
        axios.get("http://3.88.210.120:3001/getRestaurantPastOrders")
            .then(response => {
                console.log("Items Response is : " + JSON.stringify(response, null, 4));
                let {status, payload} = response.data;
                
                if (status == 200){
                    this.setState({
                        orderList : payload
                    });
                }
            });
    }

    getItemTable = (items) => {
        let itemRecords = items.map((item) => {
            return (
                <tr>
                    <td>{item["itemName"]}</td>
                    <td>{item["itemQty"]}</td>
                    <td>{item["itemPrice"]}</td>
                </tr>
            );
        });
        return itemRecords;
    }

    getOrderCards = () => {
        let orders = this.state.orderList;

        let orderCards = orders.map((order) => {
            return (
                <Card style={{ width: '50%', margin: '2rem'}} >
                    <Card.Body >
                        <Card.Title >Order ID : {order["_id"]} | Status : {order["status"]}</Card.Title>
                        <Card.Subtitle>Email : {order["buyerEmail"]}</Card.Subtitle><br/>
                        <Card.Subtitle>Address : {order["deliveryAddress"]}</Card.Subtitle><br/>
                        <Card.Text>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        {this.getItemTable(order["items"])}
                                    </tbody>
                            </Table>
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
        });
        return orderCards;
    }
	
	render() {
        let redirectVar = null;
		if(!localStorage.getItem('grubhubToken')){
			redirectVar = <Redirect to= "/ownerlogin"/>
        }
        
        let orderCards = this.getOrderCards();
        
        return(
            <div >
                {redirectVar}
                <Table style={{width: '55%', marginTop: '2rem'}}>
                <thead>
                    <tr>
                        <th colSpan='4' style={{fontWeight: 'bold', fontSize: '30px'}}>Past Orders :</th>
                    </tr>
                </thead>
                </Table>
                {orderCards}
                
			</div>
        );
        
	}
}

export default OwnerPastOrders;
