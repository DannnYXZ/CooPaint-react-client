import React from "react";
import Button from "./AccountEditor.css";
import i18nContext from "../model/i18nContext";
import {request} from "../model/Net";
import Icon from "./Icon";
import TextInput from "./TextInput";
import "./Main.css"
import TabsBrowser from "./TabsBrowser";
import {method} from "../model/config";
import Error from "./Error";
import {withRouter} from "react-router-dom";

class AccountEditor extends React.Component {
  static contextType = i18nContext;

  constructor(props) {
    super(props);
    this.inputName = React.createRef();
    this.inputEmail = React.createRef();
    this.inputPassword = React.createRef();
    this.refSubmit = React.createRef();
    this.state = {error: ''};
  }

  componentDidMount() {
    this.refreshUser();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.refreshUser();
  }

  refreshUser() {
    this.inputEmail.current.placeholder = this.props.user.email;
    this.inputName.current.placeholder = this.props.user.name;
  }

  onFileChanged(e) {
    e.preventDefault();
    if (e.target.files[0] === null)
      return;
    let selectedFile = e.target.files[0];
    // TODO: cleanup
    request(method.POST, '/set-avatar', {}, (res) => {
      const formData = new FormData();
      formData.append('file', selectedFile);
      fetch('/coopaint/upload-file', {
        method: 'POST',
        body: formData
      }).then(res => {
        if (res.ok) {
          console.log(res.data);
          return res.json();
        }
      }).then(json => {
            this.props.acceptUserData(json);
          }
      );
    })
  }

  onUserUpdated(user) {
    this.props.acceptUserData(user);
    this.props.history.goBack();
  }

  handleOnSubmit(e) {
    let name = this.inputName.current;
    let email = this.inputEmail.current;
    let passw = this.inputPassword.current;
    if (name.value === '' && email.value === '' && passw.value === '') {
      e.preventDefault();
      return false;
    }
    if (name.checkValidity()
        && email.checkValidity()
        && passw.checkValidity()) {
      e.preventDefault();
      request(method.PUT, "/user/update", {
        name: this.inputName.current.value ? this.inputName.current.value : null,
        email: this.inputEmail.current.value ? this.inputEmail.current.value : null,
        password: this.inputPassword.current.value ? this.inputPassword.current.value : null
      }, this.onUserUpdated.bind(this), (error) => {
        this.setState({error: error.body});
        this.inputEmail.current.value = '';
      });
    }
    return false;
  }

  onInputsChanged() {
    console.log(this.refs.email);
  }

  submit() {
    request(method.POST, "/coopaint/users", this.state.user);
  }

  render() {
    let t = this.context;
    let m = 20;
    return (
        <div className="account-editor-wrapper">
          <div className="account-editor round-panel">
            <TabsBrowser activeTab={0} tabNames={["Account", "Board repository"]}>
              {[<form className="account-editor">
                <div className="choose-avatar" onClick={() => document.getElementById("avatar-input").click()}
                     style={{marginBottom: m}}>
                  <Icon img={this.props.user.avatar}/>
                  <input id="avatar-input" type="file"
                         onChange={this.onFileChanged.bind(this)}
                         style={{display: "none"}}/>
                </div>
                <Error>{t[this.state.error]}</Error>
                <span>{t["name"]}</span>
                <TextInput type="text"
                           style={{marginBottom: m}}
                           placeholder={t["your.name"]}
                           className="van-input mb1"
                           rref={this.inputName}
                           minLength={3}
                           maxLength={255}
                           onEnter={() => this.refSubmit.current.click()}/>
                <span>{t["email"]}</span>
                <TextInput type="email"
                           placeholder={t["your.email"]}
                           className="van-input mb1"
                           rref={this.inputEmail}
                           minLength={3}
                           maxLength={255}
                           onEnter={() => this.refSubmit.current.click()}
                           style={{marginBottom: m}}/>
                <span>{t["password.change"]}</span>
                <TextInput type="password"
                           placeholder={t["enter.password"]}
                           className="van-input mb1"
                           rref={this.inputPassword}
                           onEnter={document.get}
                           minLength={3}
                           maxLength={4096}
                           style={{marginBottom: m}}/>

                <input ref={this.refSubmit} type="submit" className="clear-ib btn green-btn"
                       style={{display: "block", textTransform: "uppercase", fontWeight: 700}}
                       value={t["send"]}
                       onClick={this.handleOnSubmit.bind(this)}/>
              </form>]}
            </TabsBrowser>

          </div>
        </div>
    );
  }
}

export default withRouter(AccountEditor);