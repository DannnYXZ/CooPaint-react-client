import React from "react";
import "./ModalWidget.css"
import "./Main.css"
import Button from "./Button";

class ModalWidget extends React.Component {
  displayStyle() {
    return this.props.isOpened ? "" : "none";
  }

  render() {
    return (
        <div className="modal-widget" style={{display: this.displayStyle(), ...this.props.style}}>
          {this.props.onClose
              ? <Button className="btn close-btn tr"
                        img="close.svg"
                        onClick={this.props.onClose}/>
              : null}
          {this.props.children}
        </div>
    );
  }
}

export default ModalWidget;