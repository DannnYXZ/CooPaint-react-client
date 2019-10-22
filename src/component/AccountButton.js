import React from "react";
import Button from "./Button";
import Drop from "./Drop";

class AccountButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isDropped: false};
  }

  render() {
    return (
        <Button onClick={() => this.setState({isDropped: !this.state.isDropped})}>
          <img src={this.props.img || "avatar.svg"}/>
          <span style={{margin: "0 8px"}}>{this.props.username}</span>
          <img src="dropdown.svg"/>
          <Drop isOpened={this.state.isDropped} style={{top: 20}}>
            // TODO: use forms for saving password
            // TODO: drop element
            <span>1</span>
            <span>2</span>
            <span>3</span>
          </Drop>
        </Button>
    );
  }
}

export default AccountButton;