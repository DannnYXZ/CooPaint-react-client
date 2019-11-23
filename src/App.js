import React from 'react';
import './App.css';
import {post, post_async} from "./model/Net";
import i18nContext from "./model/i18nContext.js"
import {HashRouter, Route, Switch} from "react-router-dom";
import AccountEditor from "./component/AccountEditor";
import Editor from "./component/Editor";
import LangSwitcher from "./component/LangSwitcher";

function L(text) {
  console.log(text);
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      translation: {},
      isLangSelectorOpened: false
    };
    this.loadLangPack.bind(this);
  }

  async componentDidMount() {
    await post_async("/auth", {}, user => this.acceptUserData(user));
    this.loadLangPack(this.state.user.lang);
  }

  signOut() {
    post("/sign-out", {}, () => {
      this.setState({user: {}})
    });
  }

  loadLangPack(lang) {
    post("/lang-pack", {lang: lang},
        (locale) => {
          Object.assign(this.state.translation, locale);
          this.setState({isLangSelectorOpened: false});
        });
  }

  acceptUserData(user) {
    this.setState({
      user: user
    });
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

  renderLangSwitcher() {
    return (
        <LangSwitcher isOpened={this.state.isLangSelectorOpened}
                      onChange={(lang) => this.loadLangPack(lang)}
                      onClick={() => this.setState({isLangSelectorOpened: !this.state.isLangSelectorOpened})}/>
    );
  }

  renderEditor(props) {
    return (
        <Editor user={this.state.user}
                signOut={() => this.signOut()}
                acceptUserData={this.acceptUserData.bind(this)}
                {...props}/>
    );
  }

  render() {
    return (
        <i18nContext.Provider value={this.state.translation}>
          <HashRouter>
            <div className="app">
              <Switch>

                <Route exact path="/">
                  {this.renderEditor()}
                  {this.renderLangSwitcher()}
                </Route>

                <Route exact path="/b/:snapshot" render={(props) => {
                  return ([this.renderEditor(props), this.renderLangSwitcher()]);
                }}/>

                <Route path="/account">
                  <AccountEditor user={this.state.user}
                                 acceptUserData={this.acceptUserData.bind(this)}/>
                </Route>
              </Switch>
            </div>
          </HashRouter>
        </i18nContext.Provider>
    );
  }
}

export default App;