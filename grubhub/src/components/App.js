import React, {Component} from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router-dom';
import CommonNavbar from './CommonNavbar';
import BuyerLogin from './BuyerLogin';
import BuyerSignUp from './BuyerSignUp';
import OwnerLogin from './OwnerLogin';
import OwnerSignUp from './OwnerSignUp';

import {Form, Button} from 'react-bootstrap';
import '../css/App.css';

class App extends Component {

  render() {
    const btnStyle = {
      margin: '5px'
    }
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
          {/* <Route path="/buyerhome" component={OwnerSignUp}/> */}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
