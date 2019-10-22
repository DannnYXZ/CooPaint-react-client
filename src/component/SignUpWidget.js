import React from "react";
import "./Main.css"
import {post} from "../model/Model";
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";

class SignUpWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      passw: ''
    }
  }

  onKO() {
    console.log('KO');
  }

  handleOnSignUpClick() {
    let user = {
      name: this.state.email,
      email: this.state.email,
      password: this.state.passw
    };
    post("/api/sign-up", user, this.props.onSignedUp, this.onKO);
  }

  render() {
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={this.props.onClose}>
          <h1>Sign Up</h1>
          <div>
            <TextInput type="email"
                       placeholder="Your email"
                       onChangeText={(text) => this.setState({email: text})}
                       className="van-input mb1"/>
            <TextInput type="password"
                       placeholder="Enter password"
                       onChangeText={(text) => this.setState({passw: text})}
                       className="van-input mb1"/>
            <div className="hr-section fdrr">
              <Button className="button green-button" onClick={this.handleOnSignUpClick.bind(this)}>SIGN UP</Button>
            </div>
            <hr/>
            <p className="paragraph h4">Got an account?&nbsp;
              <a href="#" className="ctrl-signup" onClick={this.props.onLogInClick}><b>Log in here!</b></a>
            </p>
          </div>
        </ModalWidget>
    );
  }
}

export default SignUpWidget;