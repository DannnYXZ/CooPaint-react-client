import React from "react";
import Button from "./Button";

class AccountButton extends React.Component {
  render() {
    //className="account-button"
    return (
        <Button>
          <img src={this.props.img || "avatar.svg"}/>
          <span style={{margin: "0 8px"}}>Mr X</span>
          <img src="dropdown.svg"/>
        </Button>
    );
  }
}

export default AccountButton;