import React from "react";
import './Main.css'
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import {post} from "../model/Model";

class SignInWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  handleOnSignInClick() {
    post("/api/sign-in", {
      email: this.state.email,
      password: this.state.password
    }, this.props.onSignedIn);
  }

  render() {
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={this.props.onClose}>
          <h1>Log In</h1>
          <div>
            <TextInput type="email"
                       placeholder="Your email"
                       onChangeText={(text) => this.setState({email: text})}
                       className="van-input mb1"/>
            <TextInput type="password"
                       placeholder="Enter password"
                       onChangeText={(text) => this.setState({password: text})}
                       className="van-input mb1"/>
            <div className="hr-section">
              <a href="/restore-password">
                <b>Forgot your password?</b>
              </a>
              <Button className="button green-button" onClick={this.handleOnSignInClick.bind(this)}>LOG IN</Button>
            </div>
            <hr/>
            <p className="paragraph h4">Don’t have an account?&nbsp;
              <a href="#" className="ctrl-signup" onClick={this.props.onSignUpClick}><b>Create one here!</b></a>
            </p>
          </div>
        </ModalWidget>
    );
  }
}

export default SignInWidget;