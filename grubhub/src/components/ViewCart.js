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
            submitMessage : ""
        }
    }

    componentDidMount(){
        
        axios.defaults.withCredentials = true;

        axios.get("http://3.95.188.106:3001/getCartItems")
            .then(response => {
                console.log("Items Response is : " + JSON.stringify(response, null, 4));
                let {status, payload} = response.data;
                
                if (status == 200){
                    let totalPrice = "0";
                    for (let item in payload){
                        let itemPrice = payload[item]["price"];
                        totalPrice = eval(totalPrice + "+" + itemPrice);
                    }

                    this.setState({
                        cartItems : payload,
                        totalPrice : totalPrice
                    });
                }
            });
    }

    getCartItems = () => {
        let cartItems = this.state.cartItems;

        let items = cartItems.map( (item) => {
            return (
                <tr>
                    <td>{item["item_name"]}</td>
                    <td>{item["quantity"]}</td>
                    <td>${item["price"]}</td>
                    <td>{item["restaurant_name"]}</td>
                </tr>
            );

        });
        return items;
    }

    placeOrder = (event) => {
        event.preventDefault();

        axios.defaults.withCredentials = true;

        axios.post('http://3.95.188.106:3001/placeOrder')
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
		if(!cookie.load('grubhubusercookie')){
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
