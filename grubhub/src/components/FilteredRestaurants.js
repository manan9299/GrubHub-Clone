import React, {Component} from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class FilteredRestaurants extends Component {

    constructor(){
        super();
        this.state = {
            restaurantList : [],
            toRestaurantDetails : null
        }
    }

    componentDidMount(){
        
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubUserToken');

        axios.get("http://3.88.210.120:3001/getFilteredRestaurants")
            .then(response => {
                console.log("Response is : " + JSON.stringify(response, null, 4));
                let {status, payload} = response.data;
                
                if (status == 200){
                    this.setState({
                        restaurantList : payload
                    });
                }
            });
    }

    setRestaurant = (event) => {
        event.preventDefault();

        let reqData = {
            selectedRestaurantId : event.target.id
        }

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubUserToken');

        axios.post("http://3.88.210.120:3001/setSelectedRestaurant", reqData)
            .then( response => {
                console.log("Response is : " + JSON.stringify(response));

                if(response.status == 200){
                    let status = response.data.status;
                    if (status == 200){
                        this.setState({
                            toRestaurantDetails : <Redirect to='/showrestaurantmenu' />
                        });
                    } else {
                        this.setState({
                            toRestaurantDetails : <Redirect to='/buyerhome' />
                        });
                    }
                }
            });
    }

    getRestaurants = () => {
        let restaurantList = this.state.restaurantList;

        if (restaurantList.length == 0){
            return (
                <tr>
                    <td colSpan='4'>No Results</td>
                </tr>
            );
        } else {
            let items = restaurantList.map((restaurant) => {
                restaurant = restaurant["restaurant"];
                return (
                    <tr>
                        <td><Button variant="link" onClick={this.setRestaurant} id={restaurant["name"]}>{restaurant["name"]}</Button></td>
                        <td>{restaurant["address"]}</td>
                        <td>{restaurant["city"]}</td>
                        <td>{restaurant["contact"]}</td>
                    </tr>
                );
            });
            return items;
        }
    }
	
	render() {
        let redirectVar = null;
		if(!localStorage.getItem('grubhubUserToken')){
			redirectVar = <Redirect to= "/buyerlogin"/>
		}
        let restaurantList = this.getRestaurants();
        
        return(
            <div >
                {redirectVar}
                {this.state.toRestaurantDetails}
				<Table className="offset-sm-3" style={{width: '50%', marginTop: '2rem'}}>
                <thead>
                    <tr>
                        <th colSpan='4' style={{fontWeight: 'bold', fontSize: '30px'}}>Restaurants :</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Name</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Address</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>City</td>
                        <td style={{fontWeight: 'bold', fontSize: '20px'}}>Contact</td>
                    </tr>
                    {restaurantList}            
                </tbody>
                    
                </Table>
			</div>
        );
        
	}
}

export default FilteredRestaurants;
