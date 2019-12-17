import React from "react";
import "./Main.css"
import {request} from "../model/Net";
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import Error from "./Error";
import i18nContext from "../model/i18nContext";
import {method} from "../model/config";

class SignUpWidget extends React.Component {
  static contextType = i18nContext;

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      passw: '',
      error: ''
    };
    this.refEmail = React.createRef();
    this.refPassword = React.createRef();
    this.refSubmit = React.createRef();
  }

  clearWidget() {
    this.refEmail.current.value = '';
    this.refPassword.current.value = '';
    this.setState({error: ''});
  }

  onSignedUp(user) {
    this.props.onSignedUp(user);
    this.clearWidget();
    this.setState({error: ''});
  }

  handleOnSubmit(e) {
    if (this.refEmail.current.checkValidity() && this.refPassword.current.checkValidity()) {
      e.preventDefault();
      request(method.POST, "/sign-up", {
        email: this.refEmail.current.value,
        password: this.refPassword.current.value
      }, this.onSignedUp.bind(this), (error) => {
        this.setState({error: error.body});
        this.refEmail.current.value = '';
      });
    }
    return false;
  }

  render() {
    let t = this.context;
    return (
        <ModalWidget isOpened={this.props.isOpened}
                     style={{minWidth: 408}}
                     onClose={() => {
                       this.props.onClose();
                       this.clearWidget();
                     }}>
          <h1>{t["sign.up"]}</h1>
          <form>
            <Error>{t[this.state.error]}</Error>
            <TextInput type="email"
                       placeholder={t["your.email"]}
                       className="van-input mb1"
                       rref={this.refEmail}
                       minLength={3}
                       maxLength={255}
                       onEnter={() => this.refSubmit.current.click()}
                       autoComplete="on"
                       required/>
            <TextInput type="password"
                       placeholder={t["enter.password"]}
                       className="van-input mb1"
                       rref={this.refPassword}
                       onEnter={document.get}
                       maxLength={255}
                       pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,255}$'
                       title={t["password.constraints"]}
                       autoComplete="on"
                       required/>
            <div className="hr-section fdrr">
              <input ref={this.refSubmit} type="submit" className="clear-ib btn green-btn"
                     style={{display: "block", textTransform: "uppercase", fontWeight: 700}}
                     value={t["sign.in"]}
                     onClick={this.handleOnSubmit.bind(this)}/>
            </div>
            <hr/>
            <p className="paragraph h4">{t["got.an.account?"]}&nbsp;
              <a href="#" className="ctrl-signup" onClick={this.props.onLogInClick}><b>{t["log.in.here"]}</b></a>
            </p>
          </form>
        </ModalWidget>
    );
  }
}

export default SignUpWidget;