import React from 'react';
import '../App.css';
import JoinBoardWidget from "./JoinBoardWidget";
import Board from "./Board";
import WidgetsWrapper from "./WidgetsWrapper";
import SignInWidget from "./SignInWidget";
import AccountButton from "./AccountButton";
import SignUpWidget from "./SignUpWidget";
import Button from "./Button";
import {post} from "../model/Net";
import Drop from "./Drop";
import TextInput from "./TextInput";
import ParticipantsManagerWidget from "./ParticipantsManagerWidget";
import BoardBrowserWidget from "./BoardBrowserWidget";
import Chat from "./Chat";
import i18nContext from "../model/i18nContext.js"

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
      isParticipantsManagerOpened: false,
      isChatOpened: false,
      board: {
        name: 'Unnamed Board'
      }
    };
    this.refBoardInput = React.createRef();
    this.renderAccount.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    console.log("sdfasdsd");
  }

  onJoin(boardName) {
    this.setState({isJoinBoardWidgetOpened: false});
  }

  onSave() {

  }

  onDelete() {

  }

  onOpen() {
    this.setState({isBoardBrowserOpened: true});
  }

  onCreate() {
    post("/save-board", {})
  }

  onManage() {

    this.setState({isParticipantsManagerOpened: true});
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
        ? <AccountButton user={this.props.user} onSignOut={() => this.props.signOut()}
                         isOpened={this.state.isAccountButtonOpened}
                         onClick={() => this.setState({isAccountButtonOpened: !this.state.isAccountButtonOpened})}/>
        : <Button href="#" className="btn van-btn" onClick={() => this.setState({isSignInWidgetOpened: true})}>
          {t["log.in.or.sign.up"]}
        </Button>;
  }

  renderManager() {
    let t = this.context;
    return (
        <div className="toolbar-tl">
          <Button onClick={() => this.setState({isMainMenuOpened: !this.state.isMainMenuOpened})}>
            <TextInput rref={this.refBoardInput} placeholder={this.state.board.name} className="trans-input"/>
            <img src="dropdown.svg"/>
            <Drop isOpened={this.state.isMainMenuOpened} style={{top: 50, left: 0}}>
              <Button className="btn trans-btn" onClick={this.onSave.bind(this)}>{t["save.board"]}</Button>
              <Button className="btn trans-btn" onClick={this.onDelete.bind(this)}>{t["delete"]}</Button>
              <Button className="btn trans-btn" onClick={this.onOpen.bind(this)}>{t["open.saved.board"]}</Button>
              <Button className="btn trans-btn" onClick={this.onCreate.bind(this)}>{t["create.new.board"]}</Button>
              <Button className="btn trans-btn" onClick={this.onManage.bind(this)}>{t["manage.participants"]}</Button>
            </Drop>
          </Button>
          <Button className="btn green-btn">{t["invite"]}</Button>
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
                                       onClose={() => this.setState({isParticipantsManagerOpened: false})}/>
            <BoardBrowserWidget isOpened={this.state.isBoardBrowserOpened}
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
                <Chat user={this.props.user}/>
              </Drop>
            </Button>
          </div>
          <Board board={this.state.board}/>
        </div>
    );
  }
}

export default Editor;

// TODO: routing