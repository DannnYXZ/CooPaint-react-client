import React from "react";
import Button from "./Button";

class AccountButton extends React.Component {
  render() {
    return (
        <div className="account-button">
          <Button href="#" className="button van-button" onClick={this.props.onClick}>Sign Up or Log In</Button>
        </div>
    );
  }
}

export default AccountButton;