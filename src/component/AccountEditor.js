import React from "react";
import Button from "./AccountEditor.css";
import MyContext from "../model/Context";
import {post} from "../model/Net";
import Icon from "./Icon";

class AccountEditor extends React.Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  onFileChanged(e) {
    e.preventDefault();
    if (e.target.files[0] === null)
      return;
    this.setState({
      selectedFile: e.target.files[0]
    });
    // TODO: cleanup
    post('/set-avatar', {}, (res) => {
      const formData = new FormData();
      formData.append('file', this.state.selectedFile);
      fetch('/coopaint/upload-file', {
        method: 'post',
        body: formData
      }).then(res => {
        if (res.ok) {
          console.log(res.data);
          alert("File uploaded successfully.");
          return res.json();
        }
      }).then(json => {
            this.setState({user: json});
            this.props.onAccountUpdated(this.state.user);
          }
      );
    })
  }

  render() {
    let t = this.context;
    return (
        <div className="account-editor">
          <div className="choose-avatar" onClick={() => document.getElementById("avatar-input").click()}>
            <Icon img={this.props.user.avatar}/>
            <input id="avatar-input" type="file" onChange={this.onFileChanged.bind(this)} style={{display: "none"}}/>
          </div>
        </div>
    );
  }
}

export default AccountEditor;