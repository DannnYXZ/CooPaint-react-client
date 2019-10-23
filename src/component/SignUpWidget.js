import React from "react";
import "./Main.css"
import {post} from "../model/Model";
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import Error from "./Error";

class SignUpWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      passw: '',
      error: ''
    };
    this.refEmail = React.createRef();
    this.refPassword = React.createRef();
  }

  onSignedUp(user) {
    this.props.onSignedUp(user);
    this.refEmail.current.value = '';
    this.refPassword.current.value = '';
    this.setState({error: ''});
  }

  handleOnSignUpClick() {
    let user = {
      name: this.refEmail.current.value,
      email: this.refEmail.current.value,
      password: this.refPassword.current.value
    };
    post("/api/sign-up", user, (user) => this.onSignedUp(user), (error) => this.setState({error: error.message}));
  }

  render() {
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={this.props.onClose}>
          <h1>Sign Up</h1>
          <form>
            <Error>{this.state.error}</Error>
            <TextInput type="email"
                       placeholder="Your email"
                       className="van-input mb1"
                       rref={this.refEmail}/>
            <TextInput type="password"
                       placeholder="Enter password"
                       className="van-input mb1"
                       rref={this.refPassword}/>
            <div className="hr-section fdrr">
              <Button className="button green-button" onClick={this.handleOnSignUpClick.bind(this)}>SIGN UP</Button>
            </div>
            <hr/>
            <p className="paragraph h4">Got an account?&nbsp;
              <a href="#" className="ctrl-signup" onClick={this.props.onLogInClick}><b>Log in here!</b></a>
            </p>
          </form>
        </ModalWidget>
    );
  }
}

export default SignUpWidget;