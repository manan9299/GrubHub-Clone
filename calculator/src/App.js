import React, {Component} from 'react';
import KeyPad from './components/KeyPad';
import Display from './components/Display';
import axios from 'axios';
import './App.css';

class App extends Component {
	
	constructor(){
		super();
		this.state = {
			expression : "",
			resultCalculated : false
		}
	}

	changeExpression = (keypadValue) => {

		if (keypadValue === "="){
			this.calculate();
		} else if (keypadValue === "CLR"){
			this.reset();
		} else if (keypadValue === "DEL"){
			this.deleteLast();
		} else {
			let newExpr = this.state.expression + keypadValue;
			this.setState({
				expression : newExpr
			})
		}
	}

	calculate = () => {
		
		let reqData = {
			expression : this.state.expression
		}

		axios.post("http://localhost:3001/calculate", reqData)
			.then((response) => {
				
				this.setState({
					expression : response.data.result,
					resultCalculated : true
				})
			});
	}

	reset = () => {
		this.setState({
			expression : ""
		})
	}

	deleteLast = () => {
		let newExpression = this.state.expression;

		newExpression = newExpression.substring(0, newExpression.length - 1);

		this.setState({
			expression : newExpression
		});
	}

	render() {
		return (
			<div>
				<Display expression={this.state.expression} />
				<KeyPad onClick={this.changeExpression} />
			</div>
		);

	}
}

export default App;
