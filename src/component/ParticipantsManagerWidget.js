import React from "react";
import "./ParticipantsManager.css"
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import {post} from "../model/Model";
import Error from "./Error";
import ToggleButton from "./ToggleButton";
import Logo from "./Logo";

class ParticipantsManagerWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      participants: [
        {name: "KEK"},
        {name: "KEK"},
        {name: "KEK"},
        {name: "KEK"}
      ]
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

  handleOnSubmit(e) {
    post("/api/sign-in", {
      email: this.refEmail.current.value,
      password: this.refPassword.current.value
    }, this.onSignedIn.bind(this), (error) => this.setState({error: error.message}));
    return false;
  }

  onToggleClick(e) {
    let userId = e.target.id;
    let canEdit = e.target.checked;
  }

  render() {
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={this.props.onClose} style={{minWidth: 300}}>
          <h3>Manage participants</h3>
          <div className="participants">
            {this.state.participants
            && this.state.participants.map((p, i) => {
                  let buttonState = p.edit;
                  return <div className="participant">
                    <div className="participant-info">
                      <Logo img={p.avatar}/>
                      {p.name}
                    </div>
                    <ToggleButton id={i} state={buttonState} onClick={this.onToggleClick.bind(this)}/>
                  </div>
                }
            )}
          </div>
        </ModalWidget>
    );
  }
}

export default ParticipantsManagerWidget;