import React from 'react';
import '../App.css';
import JoinBoardWidget from "./JoinBoardWidget";
import Board from "./Board";
import WidgetsWrapper from "./WidgetsWrapper";
import SignInWidget from "./SignInWidget";
import AccountButton from "./AccountButton";
import SignUpWidget from "./SignUpWidget";
import Button from "./Button";
import Drop from "./Drop";
import TextInput from "./TextInput";
import ParticipantsManagerWidget from "./ParticipantsManagerWidget";
import BoardManagerWidget from "./BoardManagerWidget";
import Chat from "./Chat";
import i18nContext from "../model/i18nContext.js"
import {method} from "../model/config";
import {withRouter} from "react-router-dom";


export const BOARD_MODE = {OFFLINE: 0, ONLINE: 1, CREATE_NEW: 2, INVITE: 3};

class Editor extends React.Component {
  static contextType = i18nContext;

  constructor(props) {
    super(props);
    this.state = {
      isJoinBoardWidgetOpened: false,
      isSignInWidgetOpened: false,
      isSignUpWidgetOpened: false,
      isAccountButtonOpened: false,
      isMainMenuOpened: false,
      isBoardBrowserOpened: false,
      isParticipantsManagerOpened: true,
      isChatOpened: false,
      board: {
        name: 'Unnamed Board'
      },
      snapshot: {
        link: "",
        chat: {},
        board: {}
      },
      ws: null,
      boardMode: BOARD_MODE.OFFLINE
    };
    this.refBoardInput = React.createRef();
    this.refChat = React.createRef();
    this.refBoard = React.createRef();
    this.renderAccount.bind(this);
  }

  componentDidMount() {
    let snapshotLink = this.props.match.params.snapshot;
    if (snapshotLink) {
      let ws = new WebSocket(`ws://${window.location.host}/coopaint/ws`);
      ws.addEventListener("message", this.onMessage.bind(this));
      ws.onopen = () => {
        this.setState({boardMode: BOARD_MODE.ONLINE, ws: ws});
        this.getSnapshot(snapshotLink);
      };
    } else {
      this.setState({boardMode: BOARD_MODE.OFFLINE});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.snapshot !== prevProps.match.params.snapshot) {
      let snapshotLink = this.props.match.params.snapshot;
      if (snapshotLink && this.state.boardMode === BOARD_MODE.OFFLINE) {
        let ws = new WebSocket(`ws://${window.location.host}/coopaint/ws`);
        ws.addEventListener("message", this.onMessage.bind(this));
        ws.onopen = () => {
          this.setState({boardMode: BOARD_MODE.ONLINE, ws: ws});
          this.getSnapshot(snapshotLink);
        };
      } else {
        this.getSnapshot(snapshotLink);
      }
    }
  }

  componentWillUnmount() {
    if (this.state.ws) this.state.ws.close();
  }

  onOpenBoard(snapshot) {
    this.props.history.push(`/b/${snapshot.link}`);
  }

  onMessage(e) {
    let json = JSON.parse(e.data);
    switch (json.action) {
      case "add-snapshot":
        let snapshot = json.body;
        switch (this.state.boardMode) {
          case BOARD_MODE.CREATE_NEW:
            window.open(`#/b/${snapshot.link}`, "_blank");
            // this.setState({boardMode: }); previous
            break;
          case BOARD_MODE.ONLINE:
            console.log(this);
            this.refBoard.current.readBoard(snapshot.board.uuid);
            this.refChat.current.readChatHistory(snapshot.chat.uuid);
            console.log("INSTALLED SNAPSHOT");
            this.setState({snapshot});
            break;
          case BOARD_MODE.INVITE:
            this.refBoard.current.save(snapshot.board.uuid);
            console.log("INSTALLED SNAPSHOT");
            this.setState({boardMode: BOARD_MODE.ONLINE});
            this.onOpenBoard(snapshot);
            break;
        }
        break;
    }
  }

  onJoin(boardName) {
    this.setState({isJoinBoardWidgetOpened: false});
  }

  onDelete() {

  }

  onOpen() {
    this.setState({isBoardBrowserOpened: true});
  }

  onCreate() {
    this.setState({boardMode: BOARD_MODE.CREATE_NEW});
    this.getSnapshot("");
  }

  onInvite() {
    if (!this.state.snapshot.link) {
      let ws = new WebSocket(`ws://${window.location.host}/coopaint/ws`);
      ws.addEventListener("message", this.onMessage.bind(this));
      ws.onopen = () => {
        this.setState({boardMode: BOARD_MODE.INVITE, ws: ws});
        this.getSnapshot("");
      };
    }
  }

  onManage() {
    this.setState({isParticipantsManagerOpened: true});
  }

  getSnapshot(url) {
    try {
      this.state.ws.send(JSON.stringify(
          {
            method: method.GET,
            url: `/snapshot/${url}`
          }
      ));
    } catch (e) {
      console.log(e);
    }
  }

  isWrapperOpened() {
    return this.state.isJoinBoardWidgetOpened
        || this.state.isSignInWidgetOpened
        || this.state.isSignUpWidgetOpened
        || this.state.isBoardBrowserOpened
        || this.state.isParticipantsManagerOpened;
  }

  renderAccount() {
    let t = this.context;
    return this.props.user.isAuth
        ? <AccountButton user={this.props.user}
                         onSignOut={() => this.props.signOut()}
                         isOpened={this.state.isAccountButtonOpened}
                         onClick={() => this.setState({isAccountButtonOpened: !this.state.isAccountButtonOpened})}/>
        : <Button href="#" className="btn van-btn" onClick={() => this.setState({isSignInWidgetOpened: true})}>
          {t["log.in.or.sign.up"]}
        </Button>;
  }

  acceptedBoard(board) {
    this.refBoardInput.current.value = board.name;
  }

  updateBoardName() {
    this.refBoard.current.updateName(this.refBoardInput.current.value);
  }

  renderManager() {
    let t = this.context;
    return (
        <div className="toolbar-tl">
          <Button onClick={() => this.setState({isMainMenuOpened: !this.state.isMainMenuOpened})}>
            <TextInput rref={this.refBoardInput}
                       placeholder={this.state.board.name}
                       className="trans-input"
                       maxLength={32}
                       onLoseFocus={this.updateBoardName.bind(this)}/>
            <img src="dropdown.svg"/>
            <Drop isOpened={this.state.isMainMenuOpened} style={{top: 50, left: 0}}>
              <Button className="btn trans-btn" onClick={this.onInvite.bind(this)}>{t["save.board"]}</Button>
              <Button className="btn trans-btn" onClick={this.onOpen.bind(this)}>{t["open.saved.board"]}</Button>
              <Button className="btn trans-btn" onClick={this.onCreate.bind(this)}>{t["create.new.board"]}</Button>
              <Button className="btn trans-btn" onClick={this.onManage.bind(this)}>{t["manage.participants"]}</Button>
            </Drop>
          </Button>
          <Button className="btn green-btn"
                  onClick={() => this.onInvite()}>{t["invite"]}</Button>
        </div>
    );
  }

  render() {
    return (
        <div>
          <WidgetsWrapper isOpened={this.isWrapperOpened()}>
            <JoinBoardWidget onJoinBoardClick={this.onJoin.bind(this)}
                             isOpened={this.state.isJoinBoardWidgetOpened}/>
            <SignInWidget isOpened={this.state.isSignInWidgetOpened}
                          onClose={() => this.setState({isSignInWidgetOpened: false})}
                          onSignUpClick={() => {
                            this.setState({isSignInWidgetOpened: false, isSignUpWidgetOpened: true})
                          }}
                          onSignedIn={(user) => {
                            this.props.acceptUserData(user);
                            this.setState({isSignInWidgetOpened: false, isAccountButtonOpened: false})
                          }}/>
            <SignUpWidget isOpened={this.state.isSignUpWidgetOpened}
                          onClose={() => this.setState({isSignUpWidgetOpened: false})}
                          onLogInClick={() => {
                            this.setState({isSignInWidgetOpened: true, isSignUpWidgetOpened: false})
                          }}
                          onSignedUp={(user) => {
                            this.props.acceptUserData(user);
                            this.setState({isSignUpWidgetOpened: false, isAccountButtonOpened: false})
                          }}/>
            <ParticipantsManagerWidget isOpened={this.state.isParticipantsManagerOpened}
                                       boardUUID={this.state.snapshot.board.uuid}
                                       chatUUID={this.state.snapshot.chat.uuid}
                                       onClose={() => this.setState({isParticipantsManagerOpened: false})}/>
            <BoardManagerWidget isOpened={this.state.isBoardBrowserOpened}
                                onOpen={(snapshot) => {
                                  this.onOpenBoard(snapshot);
                                }}
                                onClose={() => this.setState({isBoardBrowserOpened: false})}/>
          </WidgetsWrapper>

          <div className="top-toolbars">
            {this.renderManager()}
            <div className="auth-toolbar">
              {this.renderAccount()}
            </div>
          </div>
          <div className="chat-box">
            <Button className="btn rnd-btn"
                    onClick={() => this.setState({isChatOpened: !this.state.isChatOpened})}>
              <img src="chat.svg" style={{width: "60%", height: "auto"}}/>
              <Drop isOpened={this.state.isChatOpened} style={{bottom: 60, right: 2}}>
                {[<Chat ref={this.refChat}
                        user={this.props.user}
                        chatUUID={this.state.snapshot.chat.uuid}
                        ws={this.state.ws}/>]}
              </Drop>
            </Button>
          </div>
          <Board user={this.props.user}
                 ref={this.refBoard}
                 mode={this.state.boardMode}
                 ws={this.state.ws}
                 boardUUID={this.state.snapshot.board.uuid}
                 acceptedBoard={this.acceptedBoard.bind(this)}
          />
        </div>
    );
  }
}

export default withRouter(Editor);