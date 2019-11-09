import React, {Component} from 'react';
import {Dropdown, DropdownButton, Button, Table, Card, Pagination } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import OrderStatusDropDown from './OrderStatusDropDown'

import '../css/App.css';

class ManageOrders extends Component {

    constructor(){
        super();
        this.state = {
            orderList : [],
            statusList : ["Preparing", "Ready", "Delivered"],
            updateMessage : ""
        }
    }

    componentDidMount(){
        
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubToken');

        axios.get("http://3.88.210.120:3001/getRestaurantOrders")
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

    changeOrderStatus = (status, buyerEmail) => {
        console.log("New Status" + status);
        console.log("buyerEmail" + buyerEmail);
        let reqData = {
            status : status,
            buyerEmail : buyerEmail
        }
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubToken');

        axios.post("http://3.88.210.120:3001/changeOrderStatus", reqData)
            .then(response => {
                let status = response.data.status;
                if (status == 200){
                    this.setState({
                        updateMessage : "Order Status Updated Successfully"
                    });
                }
            });
    }

    cancelOrder = (event) => {
        event.preventDefault();

        let buyerEmail = event.target.id;
        console.log("Email is ===> " + buyerEmail);
        console.log("buyerEmail" + buyerEmail);
        let reqData = {
            status : "Cancelled",
            buyerEmail : buyerEmail
        }
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubToken');

        axios.post("http://3.88.210.120:3001/changeOrderStatus", reqData)
            .then(response => {
                let status = response.data.status;
                if (status == 200){
                    this.setState({
                        updateMessage : "Order Status Updated Successfully"
                    });
                }
            });
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
                        <OrderStatusDropDown id={order["buyerEmail"]} onClick={this.changeOrderStatus} label="Change Order Status" items={this.state.statusList} />
                        <Button onClick={this.cancelOrder} id={order["buyerEmail"]} variant="outline-dark" style={{width: '28%'}} type="submit" block>
                            Cancel Order
                        </Button>
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
                        <th colSpan='4' style={{fontWeight: 'bold', fontSize: '30px'}}>Current Orders :</th>
                    </tr>
                </thead>
                </Table>
                {orderCards}
			</div>
        );
        
	}
}

export default ManageOrders;
