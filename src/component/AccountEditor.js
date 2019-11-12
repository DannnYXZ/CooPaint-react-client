import React from "react";
import Button from "./Button";
import Drop from "./Drop";
import MyContext from "../model/Context";
import {post} from "../model/Model";
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
    this.setState({
      selectedFile: e.target.files[0]
    });
    post('/set-avatar', {}, (res) => {
      const formData = new FormData();
      formData.append('file', this.state.selectedFile);
      //formData.append("fileToUpload[]", document.getElementById('fileToUpload').files[0]
      fetch('/coopaint/upload-file', {
        method: 'post',
        body: formData
      }).then(res => {
        if (res.ok) {
          return res.json();
          console.log("DDDATA");
          console.log(res.data);
          alert("File uploaded successfully.")
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
          <Icon img={this.state.user.avatar}/>
          <input type="file" onChange={this.onFileChanged.bind(this)}/>
        </div>
    );
  }
}

export default AccountEditor;