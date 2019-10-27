import React from 'react';
import './App.css';
import JoinBoardWidget from "./component/JoinBoardWidget";
import Board from "./component/Board";
import WidgetsWrapper from "./component/WidgetsWrapper";
import SignInWidget from "./component/SignInWidget";
import AccountButton from "./component/AccountButton";
import SignUpWidget from "./component/SignUpWidget";
import Button from "./component/Button";
import {post, post_async} from "./model/Model";
import {loadLocale} from "./model/Locale";
import Drop from "./component/Drop";
import TextInput from "./component/TextInput";
import ManageParticipantsWidget from "./component/ManageParticipantsWidget";
import BoardBrowserWidget from "./component/BoardBrowserWidget";

function L(text) {
  console.log(text);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoinBoardWidgetOpened: false,
      isLogInWidgetOpened: false,
      isSignUpWidgetOpened: false,
      isAuthorized: false,
      isAccountButtonOpened: false,
      isMainMenuOpened: false,
      isBoardBrowserOpened: true,
      name: '',
      avatar: '',
      boardName: 'Unnamed Board'
    };
    this.refBoardInput = React.createRef();
  }

  componentDidMount() {
    post("/api/auth", {}, this.acceptUserData.bind(this));
    //post("/lang-pack", {}, (locale) => loadLocale(locale));
    this.refBoardInput.current.value = this.state.boardName;
  }

  signOut() {
    post("/api/sign-out", {}, () => {
      this.setState({isAuthorized: false})
    });
  }

  acceptUserData(user) {
    this.setState({
      isAuthorized: true,
      name: user.name,
      // isJoinBoardWidgetOpened: false,
      isLogInWidgetOpened: false,
      isSignUpWidgetOpened: false
    });
    loadLocale(user.locale);
  }

  isWrapperOpened() {
    return this.state.isJoinBoardWidgetOpened
        || this.state.isLogInWidgetOpened
        || this.state.isSignUpWidgetOpened
        || this.state.isBoardBrowserOpened;
  }

  renderAccount() {
    return this.state.isAuthorized
        ? <AccountButton username={this.state.name} onSignOut={() => this.signOut()}
                         isOpened={this.state.isAccountButtonOpened}
                         onClick={() => this.setState({isAccountButtonOpened: !this.state.isAccountButtonOpened})}/>
        : <Button href="#" className="btn van-btn" onClick={() => this.setState({isLogInWidgetOpened: true})}>
          Log In or Sign Up
        </Button>;
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

  }

  onManage() {

  }

  renderManager() {
    return (
        <div className="toolbar-tl">
          <Button onClick={() => this.setState({isMainMenuOpened: !this.state.isMainMenuOpened})}>
            <TextInput rref={this.refBoardInput} placeholder={this.state.boardName} className="trans-input"/>
            <img src="dropdown.svg"/>
            <Drop isOpened={this.state.isMainMenuOpened} style={{top: 50, left: 1}}>
              <Button className="btn trans-btn" onClick={this.onSave}>Save board</Button>
              <Button className="btn trans-btn" onClick={this.onDelete}>Delete</Button>
              <Button className="btn trans-btn" onClick={this.onOpen.bind(this)}>Open saved board</Button>
              <Button className="btn trans-btn" onClick={this.onCreate}>Create new board</Button>
              <Button className="btn trans-btn" onClick={this.onManage}>Manage participants</Button>
            </Drop>
          </Button>
          <Button className="btn green-btn">Invite</Button>
        </div>
    );
  }

  render() {
    return (
        <div className="app">
          <WidgetsWrapper isOpened={this.isWrapperOpened()}>
            <JoinBoardWidget onJoinBoardClick={this.onJoin.bind(this)}
                             isOpened={this.state.isJoinBoardWidgetOpened}/>
            <SignInWidget isOpened={this.state.isLogInWidgetOpened}
                          onClose={() => this.setState({isLogInWidgetOpened: false})}
                          onSignUpClick={() => {
                            this.setState({isLogInWidgetOpened: false, isSignUpWidgetOpened: true})
                          }}
                          onSignedIn={(user) => this.acceptUserData(user)}/>
            <SignUpWidget isOpened={this.state.isSignUpWidgetOpened}
                          onClose={() => this.setState({isSignUpWidgetOpened: false})}
                          onLogInClick={() => {
                            this.setState({isLogInWidgetOpened: true, isSignUpWidgetOpened: false})
                          }}
                          onSignedUp={(user) => this.acceptUserData(user)}/>
            <ManageParticipantsWidget/>
            <BoardBrowserWidget isOpened={this.state.isBoardBrowserOpened}
                                onClose={() => this.setState({isBoardBrowserOpened: false})}/>
          </WidgetsWrapper>
          <div className="auth-toolbar">
            {this.renderAccount()}
          </div>
          {this.renderManager()}
          <div className="toolbar-bl">
            <Button className="rnd-btn" onClick={() => this.setState({isDropped: !this.state.isDropped})}>
              <img className="btn-img" src="globe.svg"/>
              <Drop style={{top: 3, left: 50}} className="drop-hr" isOpened={this.state.isDropped}>
                <Button className="btn trans-btn">EN</Button>
                <Button className="btn trans-btn">RU</Button>
                <Button className="btn trans-btn">DE</Button>
              </Drop>
            </Button>
          </div>
          <Board/>
        </div>
    );
  }
}

export default App;
// TODO: routing