import React from "react";
import './TextInput.css'

class TextInput extends React.Component {
  handleKeyUp(e) {
    if (e.keyCode === 13 && this.props.onEnter != null) this.props.onEnter();
  }

  render() {
    return (
        <input ref={this.props.rref}
               type={this.props.type || "text"}
               autoComplete="on"
               placeholder={this.props.placeholder}
               className={this.props.className || "van-input"}
               onKeyUp={this.handleKeyUp.bind(this)}
               onClick={(e) => e.stopPropagation()}/>
    );
  }
}

export default TextInput;