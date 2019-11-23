import React from "react";
import "./ParticipantsManager.css"
import ModalWidget from "./ModalWidget";
import {post} from "../model/Net";
import ToggleButton from "./ToggleButton";
import Logo from "./Logo";
import i18nContext from "../model/i18nContext";

class ParticipantsManagerWidget extends React.Component {
  static contextType = i18nContext;

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
    let t = this.context;
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={this.props.onClose} style={{minWidth: 300}}>
          <h3>{t["manage.participants"]}</h3>
          <div className="participants">
            {this.state.participants
            && this.state.participants.map((p, i) => {
                  let buttonState = p.edit;
                  return <div className="participant" key={i}>
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