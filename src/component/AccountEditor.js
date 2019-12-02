import React from "react";
import Button from "./Button";
import i18nContext from "../model/i18nContext";
import {request} from "../model/Net";
import Icon from "./Icon";
import TextInput from "./TextInput";
import "./Main.css"
import TabsBrowser from "./TabsBrowser";
import {method} from "../model/config";

class AccountEditor extends React.Component {
  static contextType = i18nContext;

  constructor(props) {
    super(props);
    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.nameInput = React.createRef();
  }

  componentDidMount() {
    this.refreshUser();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.refreshUser();
  }

  refreshUser() {
    this.emailInput.current.value = this.props.user.email;
    this.nameInput.current.value = this.props.user.name;
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
        <div className="account-editor round-panel">

          <TabsBrowser activeTab={0} tabNames={["Account", "Board repository"]}>
            <div className="account-editor">
              <div className="choose-avatar" onClick={() => document.getElementById("avatar-input").click()}
                   style={{marginBottom: m}}>
                <Icon img={this.props.user.avatar}/>
                <input id="avatar-input" type="file" onChange={this.onFileChanged.bind(this)}
                       style={{display: "none"}}/>
              </div>
              <span>{t["email"]}</span>
              <TextInput rref={this.emailInput} onChange={this.onInputsChanged.bind(this)} style={{marginBottom: m}}/>
              <span>{t["name"]}</span>
              <TextInput rref={this.nameInput} style={{marginBottom: m}}/>
              <span>{t["password.change"]}</span>
              <TextInput rref={this.passwordInput} style={{marginBottom: m}}/>
              <Button className="btn green-btn" style={{width: 120}}>{t["send"]}</Button>
            </div>

            <div>SALAMI</div>
          </TabsBrowser>

        </div>
    );
  }
}

export default AccountEditor;