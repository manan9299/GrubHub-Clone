import React, {Component} from 'react';

class Display extends Component {

    render() {
        let expression = this.props.expression;

        return(
            <div className="expression">
                <p>{expression}</p>
            </div>
        );
    }
}

export default Display;