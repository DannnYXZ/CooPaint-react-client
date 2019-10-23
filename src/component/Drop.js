import React from "react";
import "./Drop.css"

class Drop extends React.Component {
  render() {
    //className="account-button"
    return (
        <ul className="drop" style={{display: this.props.isOpened ? "" : "none", ...this.props.style}}>
          {this.props.children.map(e => <li>{e}</li>)}
        </ul>
    );
  }
}

export default Drop;