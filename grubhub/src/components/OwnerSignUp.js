import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap'
import '../css/App.css';

class OwnerSignUp extends Component {

  render() {

    return (
      <div className="offset-sm-4 col-sm-3">
        <Form>
          <Form.Text>
            Create Your Account
          </Form.Text>
          <Form.Group controlId="ownerName">
            <Form.Label>Name</Form.Label>
            <Form.Control  className='form-group' type="text" />
          </Form.Group>
          <Form.Group controlId="ownerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control  className='form-group' type="email" />
          </Form.Group>
          <Form.Group controlId="ownerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" />
          </Form.Group>
          <Form.Group controlId="ownerContact">
            <Form.Label>Contact</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Form.Group>
            <Button variant="primary" type="submit" block>
              Create your Account
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default OwnerSignUp;
