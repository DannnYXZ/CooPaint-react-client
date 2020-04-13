import React from "react";
import "./ParticipantsManager.css"
import ModalWidget from "./ModalWidget";
import {request} from "../model/Net";
import ToggleButton from "./ToggleButton";
import Logo from "./Logo";
import i18nContext from "../model/i18nContext";
import {method as METHOD} from "../model/config";
import TextInput from "./TextInput";

class ParticipantsManagerWidget extends React.Component {
  static contextType = i18nContext;

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      users: [],
      guests: []
    };
    this.refEmail = React.createRef();
  }

  loadACL() {
    request(METHOD.GET, `/access/${this.props.boardUUID}`, null, (acl) => {
      this.setState({...acl})
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.boardUUID && this.props.boardUUID !== prevProps.boardUUID) {
      this.loadACL();
    }
  }

  addUserToBoard() {
    request(METHOD.POST, `/access/${this.props.boardUUID}`, {
      email: this.refEmail.current.value,
      actions: ["READ_BOARD", "UPDATE_BOARD"]
    }, () => {
      request(METHOD.POST, `/access/${this.props.chatUUID}`, {
        email: this.refEmail.current.value,
        actions: ["READ_CHAT", "UPDATE_CHAT"]
      }, () => {
        this.refEmail.current.value = "";
        this.loadACL();
      })
    })
  }

  flipActorAccess(actorUUID, previousActions) {
    let hadAccess = previousActions.includes("READ_BOARD") && previousActions.includes("UPDATE_BOARD");
    request(METHOD.PUT, `/access/${this.props.boardUUID}`, {
      acl: {[actorUUID]: hadAccess ? [] : ["READ_BOARD", "UPDATE_BOARD"]}
    }, () => {
      request(METHOD.PUT, `/access/${this.props.chatUUID}`, {
        acl: {[actorUUID]: hadAccess ? [] : ["READ_CHAT", "UPDATE_CHAT"]}
      }, () => {
        this.loadACL();
      })
    })
  }

  render() {
    let t = this.context;
    return (
        <ModalWidget isOpened={this.props.isOpened}
                     onClose={this.props.onClose}
                     style={{minWidth: 300}}>
          <h3>{t["manage.participants"]}</h3>
          <div className="participants">
            <TextInput rref={this.refEmail}
                       placeholder="User's email"
                       onEnter={() => this.addUserToBoard()}/>
            {this.state.users
            && [
              <Participant user={{name: "All users", uuid: "@ALL"}}
                           actions={this.state.guests}
                           onChangeAccess={(actorUUID, actions) => this.flipActorAccess(actorUUID, actions)}/>,
              this.state.users.map((p, i) =>
                  p.actions.includes("CREATE_ACL")
                      ? null
                      : <Participant {...p}
                                     onChangeAccess={(actorUUID, actions) => this.flipActorAccess(actorUUID, actions)}/>
              )
            ]}
          </div>
        </ModalWidget>
    );
  }
}

function Participant(props) {
  let user = props.user || {};
  let actions = props.actions || [];

  function hasRights(actions) {
    console.log("HI");
    console.log(actions);
    let neededActions = ["READ_BOARD", "UPDATE_BOARD"];
    for (let x of neededActions) {
      if (!actions.includes(x)) return false;
    }
    return true;
  }

  return (
      <div className="participant" key={user.uuid}>
        <div className="participant-info">
          <Logo img={user.avatar}/>
          {user.name}
        </div>
        <ToggleButton id={user.uuid} state={hasRights(actions)}
                      onClick={() => props.onChangeAccess(user.uuid, actions)}/>
      </div>
  )
}

export default ParticipantsManagerWidget;