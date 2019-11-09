import React, {Component} from 'react';
import { Form, Button, Dropdown, DropdownButton, FormControl, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import SectionDropdown from './SectionDropdown'

import '../css/App.css';

class AddItem extends Component {

    constructor(){
        super();
        this.state = {
            name : "",
            description : "",
            price : "",
            section : "",
            restaurantId : "",
            sectionItems : [],
            submitMessage : ""
        }
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubToken');

        axios.get("http://3.88.210.120:3001/getsections")
            .then(response => {
                console.log("Response is : " + JSON.stringify(response, null, 4));
                let {status, payload, restaurant_id} = response.data;
                
                if (status == 200){
                    this.setState({
                        sectionItems : payload,
                        restaurantId : restaurant_id
                    })
                }
            });
    }

    addItem = (event) => {
        event.preventDefault();
        let {name, description, price, section, restaurantId} = this.state;

        let reqData = Object.assign({}, this.state);
        delete reqData["sectionItems"];
        delete reqData["submitMessage"];

        console.log(JSON.stringify(reqData));
        
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubToken');

        axios.post('http://3.88.210.120:3001/additem', reqData)
            .then(response => {
                console.log("response is " + JSON.stringify(response));
                if (response.status == 200){
                    let status = response.data.status;
                    if (status == "200") {
                        this.setState({
                            submitMessage : "Item Added Successfully"
                        });
                    } else {
                        this.setState({
                            submitMessage : "Failed to add Item",
                        });
                    }
                } else {
                    this.setState({
                        submitMessage : "Failed to add Item"
                    })
                }
            })
        
	}

    nameChangeHandler = (event) => {
        let name = event.target.value;
        if (name != ""){
			this.setState({
				name : name
			});
		}
    }
    
    descriptionChangeHandler = (event) => {
        let description = event.target.value;
        if (description != ""){
			this.setState({
				description : description
			});
		}
    }
    
    priceChangeHandler = (event) => {
        let price = event.target.value;
        if (price != ""){
			this.setState({
				price : price
			});
		}
    }
    
    sectionChangeHandler = (sectionName) => {
        console.log("Selected Section" + sectionName);
        this.setState({
            section : sectionName
        });
    }

  	
	render() {
        let redirectVar = null;
		if(!localStorage.getItem('grubhubToken')){
			redirectVar = <Redirect to= "/ownerlogin"/>
		}

        return(
            <div className="offset-sm-4 col-sm-3">
                {redirectVar}

                <Form>
					<Form.Text>
					Item Details : 
					</Form.Text>
					<Form.Group >
						<Form.Label>Item Name</Form.Label>
						<Form.Control onChange={this.nameChangeHandler} className='form-group' type="text" />
					</Form.Group>
                    <Form.Group >
						<Form.Label>Description</Form.Label>
						<Form.Control onChange={this.descriptionChangeHandler} className='form-group' type="text" />
					</Form.Group>
                    <SectionDropdown label="Section" onClick={this.sectionChangeHandler} items={this.state.sectionItems} />
                    <Form.Group >
						<Form.Label>Price</Form.Label>
						<Form.Control onChange={this.priceChangeHandler} className='form-group' type="text" />
					</Form.Group>
                    <Form.Group>
                        <Button onClick={this.addItem} variant="primary" type="submit" block>
                            Add Item
                        </Button>
                    </Form.Group>
                    {this.state.submitMessage}
				</Form>
			</div>
        );
        
	}
}

export default AddItem;
