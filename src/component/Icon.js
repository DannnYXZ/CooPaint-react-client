import React from "react";
import './Icon.css'

class Icon extends React.Component {
  render() {
    return (
        <div className="icon"
             style={{backgroundImage: `url("${this.props.img}")`, ...this.props.style}}/>
    );
  }
}

export default Icon;