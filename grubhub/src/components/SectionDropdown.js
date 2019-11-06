import React, {Component} from 'react';
import { Form, Button, Dropdown, DropdownButton, FormControl, InputGroup } from 'react-bootstrap';

class SectionDropdown extends Component{
    
    getDropdownItems = () => {
        let items = this.props.items;
        items = items.map((item) => {
            let sectionName = item;
            return (
                <Dropdown.Item key={sectionName} onClick={e => this.props.onClick(e.target.name)} name={sectionName} >{sectionName}</Dropdown.Item>
            );
        } );
        return items;

    }
    
    render() {
        let itemsList = this.getDropdownItems();
        return (
            <Form.Group >
                <Form.Label>Section</Form.Label>
                <DropdownButton title='Select Section' variant='danger'>
                    {itemsList}
                </DropdownButton>
            </Form.Group>
        );
    }
}

export default SectionDropdown;