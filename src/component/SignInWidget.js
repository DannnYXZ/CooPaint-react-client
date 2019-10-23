import React from "react";
import './Main.css'
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import {post} from "../model/Model";
import Error from "./Error";

class SignInWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
    this.refEmail = React.createRef();
    this.refPassword = React.createRef();
  }

  onSignedIn(user) {
    this.props.onSignedIn(user);
    this.refEmail.current.value = '';
    this.refPassword.current.value = '';
    this.setState({error: ''});
  }

  handleOnSignInClick() {
    post("/api/sign-in", {
      email: this.refEmail.current.value,
      password: this.refPassword.current.value
    }, this.onSignedIn.bind(this), (error) => this.setState({error: error.message}));
  }

  render() {
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={this.props.onClose}>
          <h1>Log In</h1>
          <div>
            <Error>{this.state.error}</Error>
            <TextInput type="email"
                       placeholder="Your email"
                       className="van-input mb1"
                       rref={this.refEmail}/>
            <TextInput type="password"
                       placeholder="Enter password"
                       className="van-input mb1"
                       rref={this.refPassword}/>
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