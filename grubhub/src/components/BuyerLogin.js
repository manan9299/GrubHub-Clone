import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap'
import '../css/App.css';

class BuyerLogin extends Component {

  render() {

    return (
      <div className="offset-sm-4 col-sm-3">
        <Form>
          <Form.Text>
            Sign In to your Grubhub Account
          </Form.Text>
          <Form.Group controlId="buyerEmailId">
            <Form.Label>Email address</Form.Label>
            <Form.Control  className='form-group' type="email" />
          </Form.Group>

          <Form.Group controlId="buyerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" />
          </Form.Group>
          <Form.Group>
            <Button variant="danger" type="submit" block>
              Sign In
            </Button>
          </Form.Group>
          <Form.Group>
            <Button variant="link" type="submit" href='buyersignup' block>
              Create an Account
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default BuyerLogin;
