import React from "react";
import './Error.css'

class Error extends React.Component {
  render() {
    return (
        this.props.children && <div className="error-msg">
          {this.props.children}
        </div>
    );
  }
}

export default Error;