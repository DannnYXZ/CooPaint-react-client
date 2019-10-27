import React from "react";
import "./ToggleButton.css"

class ToggleButton extends React.Component {
  render() {
    return (
        <div>
          <input type="checkbox" id={this.props.id} onClick={(e) => this.props.onClick(e)}/> <label for={this.props.id}/>
        </div>
    );
  }
}

export default ToggleButton;