import React, {Component} from 'react';
import {Dropdown, DropdownButton, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class ViewCart extends Component {

    constructor(){
        super();
        this.state = {
            cartItems : [],
            totalPrice : "0",
            submitMessage : "",
            restaurant : ""
        }
    }

    componentDidMount(){
        
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubUserToken');

        axios.get("http://3.88.210.120:3001/getCartItems")
            .then(response => {
                console.log("Items Response is : " + JSON.stringify(response, null, 4));
                let {status, payload} = response.data;
                
                if (status == 200){
                    let restaurant = payload.restaurant;
                    payload = payload.items;
                    console.log("Payload => " + JSON.stringify(payload));
                    let totalPrice = "0";
                    for (let item in payload){
                        let itemPrice = payload[item]["itemPrice"];
                        totalPrice = eval(totalPrice + "+" + itemPrice);
                    }

                    this.setState({
                        cartItems : payload,
                        totalPrice : totalPrice,
                        restaurant : restaurant
                    });
                }
            });
    }

    getCartItems = () => {
        let cartItems = this.state.cartItems;

        let items = cartItems.map( (item) => {
            return (
                <tr>
                    <td>{item["itemName"]}</td>
                    <td>{item["itemQty"]}</td>
                    <td>${item["itemPrice"]}</td>
                    <td>{this.state.restaurant}</td>
                </tr>
            );

        });
        return items;
    }

    placeOrder = (event) => {
        event.preventDefault();

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubUserToken');

        axios.post('http://3.88.210.120:3001/placeOrder')
            .then(response => {
                console.log("response is " + JSON.stringify(response));
                if (response.status == 200){
                    let status = response.data.status;
                    if (status == "200") {
                        this.setState({
                            submitMessage : "Order placed successfully",
                            cartItems : [],
                            totalPrice : "--"
                        });
                    } else {
                        this.setState({
                            submitMessage : "Failed to place Order",
                        });
                    }
                } else {
                    this.setState({
                        submitMessage : "Failed to place Order"
                    })
                }
            })
    }
	
	render() {
        let redirectVar = null;
		if(!localStorage.getItem('grubhubUserToken')){
			redirectVar = <Redirect to= "/buyerlogin"/>
        }
        
        let cartItems = this.getCartItems();
        
        return(
            <div >
                {redirectVar}
                <Button onClick={this.placeOrder} style={{marginTop : "20px"}} className="offset-sm-8">Place Order</Button><br/>
                {this.state.submitMessage}
				<Table className="offset-sm-3" style={{width: '50%', marginTop: '2rem'}}>
                <thead>
                    <tr>
                        <th colSpan='4' style={{fontWeight: 'bold', fontSize: '30px'}}>Cart :</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Name</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Quantity</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Price</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Restaurant</td>
                    </tr>
                    {cartItems}
                    <tr>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}} colSpan='2'>Total Price : </td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>${this.state.totalPrice}</td>
                        <td></td>
                    </tr>
                </tbody>
                
                </Table>
			</div>
        );
        
	}
}

export default ViewCart;
