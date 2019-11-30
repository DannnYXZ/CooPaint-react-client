import React from "react";
import "./Drop.css"

class Drop extends React.Component {
  render() {
    return (
        <ul className={this.props.className || "drop"}
            style={{display: this.props.isOpened ? "" : "none", ...this.props.style}}>
          {this.props.children.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
    );
  }
}

export default Drop;