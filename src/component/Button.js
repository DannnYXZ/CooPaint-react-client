import React from "react";
import './Button.css'

class Button extends React.Component {
  render() {
    return (
        <a href={this.props.href || "#"} className={"link-btn"}>
          <div className={this.props.className || "button van-button"}
               onClick={() => {
                 if (this.props.onClick) this.props.onClick()
               }}
          >
            {this.props.img && <img className="button-img" src={this.props.img}/>}
            {this.props.children}
          </div>
        </a>
    );
  }
}

export default Button;