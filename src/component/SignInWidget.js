import React from "react";
import './Main.css'
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import {request} from "../model/Net";
import Error from "./Error";
import i18nContext from "../model/i18nContext";
import {method} from "../model/config";

class SignInWidget extends React.Component {
  static contextType = i18nContext;

  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
    this.refEmail = React.createRef();
    this.refPassword = React.createRef();
    this.refSubmit = React.createRef();
  }

  componentDidUpdate() {
    this.refEmail.current.focus();
  }

  clearWidget() {
    this.refEmail.current.value = '';
    this.refPassword.current.value = '';
    this.setState({error: ''})
  }

  onSignedIn(user) {
    this.clearWidget();
    this.props.onSignedIn(user);
  }

  handleOnSubmit(e) {
    if (this.refEmail.current.checkValidity() && this.refPassword.current.checkValidity()) {
      e.preventDefault();
      request(method.POST, "/sign-in", {
        email: this.refEmail.current.value,
        password: this.refPassword.current.value
      }, this.onSignedIn.bind(this), (error) => {
        this.setState({error: error.body});
        this.refEmail.current.value = '';
      });
    }
    return false;
  }

  render() {
    let t = this.context;
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={() => {
          this.clearWidget();
          this.props.onClose();
        }}>
          <h1>{t["sign.in"]}</h1>
          <form lang="fr">
            <Error>{t[this.state.error]}</Error>
            <TextInput type="email"
                       placeholder={t["your.email"]}
                       className="van-input mb1"
                       rref={this.refEmail}
                       minLength={3}
                       maxLength={255}
                       onEnter={() => this.refSubmit.current.click()}
                       required/>
            <TextInput type="password"
                       placeholder={t["enter.password"]}
                       className="van-input mb1"
                       rref={this.refPassword}
                       onEnter={document.get}
                       minLength={3}
                       maxLength={4096}
                       required/>
            <div className="hr-section">
              <a href="/restore-password">
                <b>{t["forgot.password?"]}</b>
              </a>
              <input ref={this.refSubmit} type="submit" className="clear-ib btn green-btn"
                     style={{display: "block", textTransform: "uppercase", fontWeight: 700}}
                     value={t["sign.in"]}
                     onClick={this.handleOnSubmit.bind(this)}/>
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