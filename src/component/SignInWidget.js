import React from "react";
import './Main.css'
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import {post} from "../model/Net";
import Error from "./Error";
import MyContext from "../model/Context";

class SignInWidget extends React.Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
    this.refEmail = React.createRef();
    this.refPassword = React.createRef();
  }

  clearWidget() {
    this.refEmail.current.value = '';
    this.refPassword.current.value = '';
    this.setState({error: ''})
  }

  onSignedIn(user) {
    this.props.onSignedIn(user);
    this.clearWidget();
    this.setState({error: ''});
  }

  handleOnSubmit(e) {
    post("/sign-in", {
      email: this.refEmail.current.value,
      password: this.refPassword.current.value
    }, this.onSignedIn.bind(this), (error) => this.setState({error: error.body}));
    return false;
  }

  render() {
    let t = this.context;
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={() => {
          this.props.onClose();
          this.clearWidget();
        }}>
          <h1>{t["sign.in"]}</h1>
          <form>
            <Error>{t[this.state.error]}</Error>
            <TextInput type="email"
                       placeholder={t["your.email"]}
                       className="van-input mb1"
                       rref={this.refEmail}
                       onEnter={this.handleOnSubmit.bind(this)}/>
            <TextInput type="password"
                       placeholder={t["enter.password"]}
                       className="van-input mb1"
                       rref={this.refPassword}
                       onEnter={this.handleOnSubmit.bind(this)}/>
            <div className="hr-section">
              <a href="/restore-password">
                <b>{t["forgot.password?"]}</b>
              </a>
              <Button className="btn green-btn" onClick={this.handleOnSubmit.bind(this)}
                      style={{textTransform: "uppercase"}}>
                {t["sign.in"]}
              </Button>
            </div>
            <hr/>
            <p className="paragraph h4">{t["dont.have.an.account?"]}&nbsp;
              <a href="#" className="ctrl-signup" onClick={this.props.onSignUpClick}><b>{t["create.one.here"]}</b></a>
            </p>
          </form>
        </ModalWidget>
    );
  }
}

export default SignInWidget;