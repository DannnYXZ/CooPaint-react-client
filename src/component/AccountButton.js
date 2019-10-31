import React from "react";
import Button from "./Button";
import Drop from "./Drop";
import MyContext from "../model/Context";

class AccountButton extends React.Component {
  static contextType = MyContext;

  render() {
    let t = this.context;
    return (
        <Button onClick={() => this.props.onClick()}>
          <img src={this.props.img || "avatar.svg"}/>
          <span style={{margin: "0 8px"}}>{this.props.username}</span>
          <img src="dropdown.svg"/>
          <Drop isOpened={this.props.isOpened} style={{top: 50}}>
            <Button className="btn trans-btn" onClick={this.props.onSignOut}>{t["sign.out"]}</Button>
          </Drop>
        </Button>
    );
  }
}

export default AccountButton;