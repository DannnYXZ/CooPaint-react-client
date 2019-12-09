import React from "react";
import './TextInput.css'

class TextInput extends React.Component {
  handleKeyUp(e) {
    if (e.keyCode === 13 && this.props.onEnter != null) this.props.onEnter();
  }
//
//className="van-input mb1"
  render() {
    return (
        <input ref={this.props.rref}
               {...this.props}
               className={this.props.className || "van-input"}
               autoComplete="on"
               onKeyUp={this.handleKeyUp.bind(this)}
               onClick={(e) => e.stopPropagation()}
               onChange={this.props.onChange}/>
    );
  }
}

export default TextInput;