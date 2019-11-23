import React from "react";
import "./Main.css"
import {post} from "../model/Net";
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import Error from "./Error";
import i18nContext from "../model/i18nContext";

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

  handleOnSignUpClick() {
    let user = {
      email: this.refEmail.current.value,
      password: this.refPassword.current.value
    };
    post("/sign-up", user, (user) => this.onSignedUp(user), (error) => this.setState({error: error.body}));
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
                       onEnter={this.handleOnSignUpClick.bind(this)}/>
            <TextInput type="password"
                       placeholder={t["enter.password"]}
                       className="van-input mb1"
                       rref={this.refPassword}
                       onEnter={this.handleOnSignUpClick.bind(this)}/>
            <div className="hr-section fdrr">
              <Button className="btn green-btn" onClick={this.handleOnSignUpClick.bind(this)}
                      style={{textTransform: "uppercase"}}>
                {t["sign.up"]}
              </Button>
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