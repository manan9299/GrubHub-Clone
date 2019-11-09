import React, {Component} from 'react';
import { Form, Button, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import '../css/App.css';

class AddSection extends Component {

    constructor(){
        super();
        this.state = {
            sectionName : "",
            isSectionNameValid : false,
            submitMessage : ""
        }
    }

    addSection = (event) => {
        event.preventDefault();

        if (this.state.isSectionNameValid){
            let reqData = {
                sectionName : this.state.sectionName
            }
            console.log(JSON.stringify(reqData));

            axios.defaults.headers.common['Authorization'] = localStorage.getItem('grubhubToken');
    
            axios.post('http://3.88.210.120:3001/addsection', reqData)
                .then(response => {
                    console.log("response is " + JSON.stringify(response));
                    if (response.status == 200){
                        let status = response.data.status;
                        if (status == "200") {
                            this.setState({
                                submitMessage : "Section Added Successfully"
                            });
                        } else if (status == "409") {
                            this.setState({
                                submitMessage : "Section Already Exists"
                            });
                        } else {
                            this.setState({
                                submitMessage : "Failed to insert section",
                            });
                        }
                    } else {
                        this.setState({
                            submitMessage : "Failed to insert section"
                        })
                    }
                })
        }
        
		
	}

    nameChangeHandler = (event) => {
        let sectionName = event.target.value;
        if (sectionName != ""){
			this.setState({
				sectionName : sectionName,
				isSectionNameValid : true
			});
		} else {
            this.setState({
                isSectionNameValid : false
            });
        }
	}

  	
	render() {
        let redirectVar = null;
		if(!localStorage.getItem('grubhubToken')){
			redirectVar = <Redirect to= "/ownerlogin"/>
		}

        let errMessage = this.state.isSectionNameValid ? "" : "Section Name should not be empty";

        return(
            <div className="offset-sm-4 col-sm-3">
                {redirectVar}

                <Form>
					<Form.Text>
					Add a new Menu Section
					</Form.Text>
					<Form.Group >
						<Form.Label>Section Name</Form.Label>
						<Form.Control onChange={this.nameChangeHandler} className='form-group' type="text" />
					</Form.Group>
                    <Form.Group>
                        <Button onClick={this.addSection} variant="primary" type="submit" disabled={!this.state.isSectionNameValid} block>
                            Add Section
                        </Button>
                        <br/>
                        {errMessage}<br/>
                        {this.state.submitMessage}
                    </Form.Group>
				</Form>
			</div>
        );
        
	}
}

export default AddSection;
