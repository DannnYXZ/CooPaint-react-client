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
import Drop from "./component/Drop";
import TextInput from "./component/TextInput";
import ParticipantsManagerWidget from "./component/ParticipantsManagerWidget";
import BoardBrowserWidget from "./component/BoardBrowserWidget";
import Chat from "./component/Chat";
import MyContext from './model/Context.js'
import AccountEditor from "./component/AccountEditor";

function L(text) {
  console.log(text);
}

class App extends React.Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      isJoinBoardWidgetOpened: false,
      isLogInWidgetOpened: false,
      isSignUpWidgetOpened: false,
      isAuthorized: false,
      isAccountButtonOpened: false,
      isMainMenuOpened: false,
      isBoardBrowserOpened: false,
      isParticipantsManagerOpened: false,
      isChatOpened: false,
      user: {},
      boardName: 'Unnamed Board',
      translation: {}
    };
    this.refBoardInput = React.createRef();
    this.renderAccount.bind(this);
    this.loadLangPack.bind(this);
  }

  async componentDidMount() {
    await post_async("/auth", {}, user => this.acceptUserData(user));
    //await post_async("/api/lang-pack", {lang: this.state.user.lang},
    this.loadLangPack(this.state.user.lang);
    this.refBoardInput.current.value = this.state.boardName;
  }

  loadLangPack(lang) {
    post("/lang-pack", {lang: lang},
        (locale) => {
          this.setState({translation: locale});
          this.forceUpdate();
        });
  }

  signOut() {
    post("/sign-out", {}, () => {
      this.setState({isAuthorized: false})
    });
    this.setState({isAccountButtonOpened: false});
  }

  acceptUserData(user) {
    this.setState({
      isAuthorized: user.isAuth,
      user: user,
      isLogInWidgetOpened: false,
      isSignUpWidgetOpened: false
    });
    this.forceUpdate();
  }

  isWrapperOpened() {
    return this.state.isJoinBoardWidgetOpened
        || this.state.isLogInWidgetOpened
        || this.state.isSignUpWidgetOpened
        || this.state.isBoardBrowserOpened
        || this.state.isParticipantsManagerOpened;
  }

  renderAccount() {
    console.log("rendering account");
    console.log(this);
    console.log(this.context);
    let t = this.state.translation;
    return this.state.isAuthorized
        ? <AccountButton user={this.state.user} onSignOut={() => this.signOut()}
                         isOpened={this.state.isAccountButtonOpened}
                         onClick={() => this.setState({isAccountButtonOpened: !this.state.isAccountButtonOpened})}/>
        : <Button href="#" className="btn van-btn" onClick={() => this.setState({isLogInWidgetOpened: true})}>
          {t["log.in.or.sign.up"]}
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
    post("/save-board", {})
  }

  onManage() {

    this.setState({isParticipantsManagerOpened: true});
  }

  renderManager() {
    let t = this.state.translation;
    return (
        <div className="toolbar-tl">
          <Button onClick={() => this.setState({isMainMenuOpened: !this.state.isMainMenuOpened})}>
            <TextInput rref={this.refBoardInput} placeholder={this.state.boardName} className="trans-input"/>
            <img src="dropdown.svg"/>
            <Drop isOpened={this.state.isMainMenuOpened} style={{top: 57, left: 0}}>
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
        <MyContext.Provider value={this.state.translation}>
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
              <ParticipantsManagerWidget isOpened={this.state.isParticipantsManagerOpened}
                                         onClose={() => this.setState({isParticipantsManagerOpened: false})}/>
              <BoardBrowserWidget isOpened={this.state.isBoardBrowserOpened}
                                  onClose={() => this.setState({isBoardBrowserOpened: false})}/>
            </WidgetsWrapper>

            <div className="top-toolbars">

              <AccountEditor onAccountUpdated={(user) => this.acceptUserData(user)}/>
              {this.renderManager()}
              <div className="auth-toolbar">
                {this.renderAccount()}
              </div>
            </div>
            <div className="toolbar-bl">
              <Button className="rnd-btn" onClick={() => this.setState({isDropped: !this.state.isDropped})}
                      img="globe.svg">
                <Drop style={{top: 3, left: 50}} className="drop-hr" isOpened={this.state.isDropped}>
                  <Button className="btn trans-btn" onClick={() => this.loadLangPack("EN")}>EN</Button>
                  <Button className="btn trans-btn" onClick={() => this.loadLangPack("RU")}>RU</Button>
                </Drop>
              </Button>
            </div>
            <div className="chat-box">
              <Button className="btn rnd-btn" onClick={() => this.setState({isChatOpened: !this.state.isChatOpened})}>
                <img src="chat.svg" style={{width: "60%", height: "auto"}}/>
                <Drop isOpened={this.state.isChatOpened} style={{bottom: 60, right: 2}}>
                  <Chat user={this.state.user}/>
                </Drop>
              </Button>
            </div>
            <Board/>
          </div>
        </MyContext.Provider>
    );
  }
}

export default App;
// TODO: routing