import React from "react";
import "./Drop.css"

class Drop extends React.Component {
  render() {
    return (
        <ul className={this.props.className || "drop"}
            style={{display: this.props.isOpened ? "" : "none", ...this.props.style}}>
          {Array.isArray(this.props.children)
              ? this.props.children.map(e => <li>{e}</li>)
              : <li>{this.props.children}</li>}
        </ul>
    );
  }
}

export default Drop;