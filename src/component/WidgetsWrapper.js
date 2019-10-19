import React from "react";
import './WidgetsWrapper.css'

class WidgetsWrapper extends React.Component {
  displayStyle() {
    return this.props.isOpened ? "" : "none";
  }

  render() {
    return (
        <div className="widgets-wrapper" style={{display: this.displayStyle()}}>
          {this.props.children}
        </div>
    );
  }
}

export default WidgetsWrapper;