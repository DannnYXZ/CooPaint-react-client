import React from "react";
import "./ToggleButton.css"

class ToggleButton extends React.Component {
  render() {
    return (
        <div>
          <input type="checkbox" checked={this.props.state}
                 id={this.props.id}
                 onClick={(e) => this.props.onClick(e)}/>
          <label htmlFor={this.props.id}/>
        </div>
    );
  }
}

export default ToggleButton;