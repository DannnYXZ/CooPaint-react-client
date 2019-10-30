import React from "react";
import './Button.css'

class Button extends React.Component {
  render() {
    return (
        <div className={this.props.className || "btn van-btn"}
             onClick={(e) => {
               e.stopPropagation();
               if (this.props.onClick) this.props.onClick()
             }}
             style={{...this.props.style}}
        >
          {this.props.img && <img className="btn-img" src={this.props.img}/>}
          {this.props.children}
        </div>
    );
  }
}

export default Button;