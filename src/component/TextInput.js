import React from "react";
import './TextInput.css'

class TextInput extends React.Component {
  handleKeyUp(e) {
    if (e.keyCode === 13 && this.props.onEnter != null) this.props.onEnter();
  }

  render() {
    return (
        <input type="text"
               placeholder={this.props.placeholder}
               className={this.props.className || "van-input"}
               onChange={(e) => this.props.onChangeText(e.target.value)}
               onKeyUp={this.handleKeyUp.bind(this)}/>
    );
  }
}

export default TextInput;