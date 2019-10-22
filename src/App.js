import React from 'react';
import './App.css';
import JoinBoardWidget from "./component/JoinBoardWidget";
import Board from "./component/Board";
import WidgetsWrapper from "./component/WidgetsWrapper";
import SignInWidget from "./component/SignInWidget";
import AccountButton from "./component/AccountButton";
import SignUpWidget from "./component/SignUpWidget";
import Button from "./component/Button";
import {post} from "./model/Model";

function L(text) {
  console.log(text);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoinBoardWidgetOpened: true,
      isLogInWidgetOpened: false,
      isSignUpWidgetOpened: false,
      isAuthorized: false,
      name: '',
      avatar: ''
    };
  }

  componentDidMount() {
    post("/api/auth", {}, this.acceptUserData.bind(this));
  }

  acceptUserData(user) {
    this.setState({
      isAuthorized: true,
      name: user.name,
      // isJoinBoardWidgetOpened: false,
      isLogInWidgetOpened: false,
      isSignUpWidgetOpened: false
    });
    console.log(this.state);
  }

  handleJoinButtonClick(boardName) {
    this.setState({isJoinBoardWidgetOpened: false});
  }

  isWrapperOpened() {
    return this.state.isJoinBoardWidgetOpened || this.state.isLogInWidgetOpened || this.state.isSignUpWidgetOpened;
  }

  renderAccount() {
    //localStorage.
    return this.state.isAuthorized
        ? <AccountButton username={this.state.name} onClick={() => this.setState({isLogInWidgetOpened: true})}/>
        : <Button href="#" className="button van-button" onClick={() => this.setState({isLogInWidgetOpened: true})}>
          Log In or Sign Up
        </Button>;
  }

  render() {
    return (
        <div className="app">
          <WidgetsWrapper isOpened={this.isWrapperOpened()}>
            <JoinBoardWidget onJoinBoardClick={this.handleJoinButtonClick.bind(this)}
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
          </WidgetsWrapper>
          <div className="auth-toolbar">
            {this.renderAccount()}
          </div>
          <Board/>
        </div>
    );
  }
}

export default App;
// TODO: routing