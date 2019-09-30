import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap'
import '../css/App.css';

class OwnerLogin extends Component {

  render() {

    return (
      <div className="offset-sm-4 col-sm-3">
        <Form>
          <Form.Text>
            Partner Sign In
          </Form.Text>
          <Form.Group controlId="ownerEmailId">
            <Form.Label>Email address</Form.Label>
            <Form.Control  className='form-group' type="email" />
          </Form.Group>
          <Form.Group controlId="ownerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" />
          </Form.Group>
          <Form.Group>
            <Button variant="danger" type="submit" block>
              Sign In
            </Button>
          </Form.Group>
          <Form.Group>
            <Button variant="link" type="submit" href='ownersignup' block>
              Become a Partner
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default OwnerLogin;
