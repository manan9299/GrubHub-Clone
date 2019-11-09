import React, {Component} from 'react';
import {Dropdown, DropdownButton, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class RestaurantMenu extends Component {

    constructor(){
        super();
        this.state = {
            restaurantMenu : [],
            itemsForCart : {},
            itemPrices : {},
            submitMessage : ""
        }
    }

    componentDidMount(){
        
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubUserToken');

        axios.get("http://3.88.210.120:3001/getRestaurantItems")
            .then(response => {
                console.log("Items Response is : " + JSON.stringify(response, null, 4));
                let {status, payload} = response.data;
                
                if (status == 200){
                    this.setState({
                        restaurantMenu : payload
                    });
                }
            });
    }

    setItemQuantity = (event) => {
        let itemQty = event.target.name;
        let itemName = event.target.id;
        console.log("Item Name : " + itemName);
        console.log("Item Qty : " + itemQty);
        let newItem = {};
        newItem[itemName] = itemQty
        
        let currentListToAdd = this.state.itemsForCart;
        let updatedListToAdd = Object.assign(currentListToAdd, newItem)
        this.setState({
            itemsForCart : updatedListToAdd            
        })
        this.setItemPrice(itemName, itemQty);

        console.log("State : " + JSON.stringify(this.state));
        console.log("Item Prices State : " + JSON.stringify(this.state.itemPrices));
    }

    setItemPrice = (itemName, itemQty) => {
        let restaurantMenu = this.state.restaurantMenu;
        
        for (let item in restaurantMenu){
            
            if(restaurantMenu[item]["name"] == itemName){
                let newItemPrice = {};
                let itemPrice = restaurantMenu[item]["price"];
                itemPrice = itemPrice * itemQty;
                itemPrice = itemPrice.toFixed(2);
                newItemPrice[itemName] = itemPrice

                let currentItemPrice = this.state.itemPrices;
                let updatedItemPrice = Object.assign(currentItemPrice, newItemPrice);
                this.setState({
                    itemPrices : updatedItemPrice
                });
            }
        }
    }

    getRestaurantMenu = () => {
        let restaurantMenuItems = this.state.restaurantMenu;

        let menuItems = restaurantMenuItems.map( (item) => {
            return (
                <tr>
                    <td>{item["name"]}</td>
                    <td>{item["description"]}</td>
                    <td>{item["price"]}</td>
                    <td>
                    <DropdownButton title='Select Quantity' variant='danger'>
                        <Dropdown.Item id={item["name"]} onClick={this.setItemQuantity} name="1">1</Dropdown.Item>
                        <Dropdown.Item id={item["name"]} onClick={this.setItemQuantity} name='2'>2</Dropdown.Item>
                        <Dropdown.Item id={item["name"]} onClick={this.setItemQuantity} name='3'>3</Dropdown.Item>
                        <Dropdown.Item id={item["name"]} onClick={this.setItemQuantity} name='4'>4</Dropdown.Item>
                        <Dropdown.Item id={item["name"]} onClick={this.setItemQuantity} name='5'>5</Dropdown.Item>
                    </DropdownButton>
                    </td>
                </tr>
            );

        });
        return menuItems;
    }
    
    addToCart = (event) => {
        event.preventDefault();

        let reqData = Object.assign({}, this.state);
        delete reqData["restaurantMenu"];
        delete reqData["submitMessage"];

        console.log(JSON.stringify(reqData));
        
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubUserToken');

        axios.post('http://3.88.210.120:3001/addToCart', reqData)
            .then(response => {
                console.log("response is " + JSON.stringify(response));
                if (response.status == 200){
                    let status = response.data.status;
                    if (status == "200") {
                        this.setState({
                            submitMessage : "Items Added to Cart Successfully"
                        });
                    } else {
                        this.setState({
                            submitMessage : "Failed to add Items to Cart",
                        });
                    }
                } else {
                    this.setState({
                        submitMessage : "Failed to add Items to Cart"
                    })
                }
            })
    }

	
	render() {
        let redirectVar = null;
		if(!localStorage.getItem('grubhubUserToken')){
			redirectVar = <Redirect to= "/buyerlogin"/>
		}
        let restaurantMenu = this.getRestaurantMenu();
        
        return(
            <div >
                {redirectVar}
                {/* {this.state.toRestaurantDetails} */}
                <Button onClick={this.addToCart} style={{marginTop : "20px"}} className="offset-sm-8">Add to Cart</Button><br/>
                {this.state.submitMessage}
				<Table className="offset-sm-3" style={{width: '50%', marginTop: '2rem'}}>
                <thead>
                    <tr>
                        <th colSpan='4' style={{fontWeight: 'bold', fontSize: '30px'}}>Restaurant Menu :</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Name</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Description</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Price</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Quantity</td>
                    </tr>
                    {restaurantMenu}
                </tbody>
                
                </Table>
			</div>
        );
        
	}
}

export default RestaurantMenu;
