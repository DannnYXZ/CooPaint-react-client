import React from "react";
import Button from "./Button";
import Drop from "./Drop";
import i18nContext from "../model/i18nContext";
import Icon from "./Icon";
import {Link} from "react-router-dom";

class AccountButton extends React.Component {
  static contextType = i18nContext;

  render() {
    let t = this.context;
    return (
        <Button onClick={() => this.props.onClick()}>
          <Icon img={this.props.user.avatar || "avatar.svg"} style={{width: 40, height: 40}}/>
          <span style={{margin: "0 8px"}}>{this.props.user.name}</span>
          <img src="dropdown.svg"/>
          <Drop isOpened={this.props.isOpened} style={{top: 50}}>
            <Link to="/account" style={{color: "transparent", listStyleType: "none", textAlign: "center"}}>
              <Button className="btn trans-btn">{t["account"]}</Button>
            </Link>
            <Button className="btn trans-btn" onClick={this.props.onSignOut}>{t["sign.out"]}</Button>
          </Drop>
        </Button>
    );
  }
}

export default AccountButton;