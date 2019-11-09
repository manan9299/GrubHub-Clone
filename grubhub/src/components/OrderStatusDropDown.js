import React, {Component} from 'react';
import { Form, Button, Dropdown, DropdownButton, FormControl, InputGroup } from 'react-bootstrap';

class OrderStatusDropDown extends Component{
    
    getDropdownItems = () => {
        let items = this.props.items;
        items = items.map((item) => {
            let sectionName = item;
            return (
                <Dropdown.Item id={this.props.id} onClick={e => this.props.onClick(e.target.name, e.target.id)} name={sectionName} >{sectionName}</Dropdown.Item>
            );
        } );
        return items;

    }
    
    render() {
        let itemsList = this.getDropdownItems();
        let label = this.props.label;
        return (
            <Form.Group >
                <DropdownButton style={{width: '28%'}} title={label} variant='danger'>
                    {itemsList}
                </DropdownButton>
            </Form.Group>
        );
    }
}

export default OrderStatusDropDown;