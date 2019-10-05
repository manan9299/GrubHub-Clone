import React, {Component} from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router-dom';
import CommonNavbar from './CommonNavbar';
import BuyerLogin from './BuyerLogin';
import BuyerSignUp from './BuyerSignUp';
import OwnerLogin from './OwnerLogin';
import OwnerSignUp from './OwnerSignUp';
import OwnerHome from './OwnerHome';
import BuyerHome from './BuyerHome';
import RestaurantInfo from './RestaurantInfo';
import AddSection from './AddSection';
import AddItem from './AddItem';

import '../css/App.css';

class App extends Component {

  render() {
    
    return (
      <BrowserRouter>
        <div>
          {/* <CommonNavbar /> */}
          {/* replace path / with Home Component */}
          <Route path="/" component={CommonNavbar}/>
          <Route path="/buyerlogin" component={BuyerLogin}/>
          <Route path="/buyersignup" component={BuyerSignUp}/>
          <Route path="/ownerlogin" component={OwnerLogin}/>
          <Route path="/ownersignup" component={OwnerSignUp}/>
          <Route path="/ownerhome" component={OwnerHome}/>
          <Route path="/buyerhome" component={BuyerHome}/>
          <Route path="/restaurantinfo" component={RestaurantInfo}/>
          <Route path="/addsection" component={AddSection}/>
          <Route path="/additem" component={AddItem}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
