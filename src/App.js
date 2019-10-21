import React from 'react';
import './App.css';
import JoinBoardWidget from "./component/JoinBoardWidget";
import Board from "./component/Board";
import WidgetsWrapper from "./component/WidgetsWrapper";
import LogInWidget from "./component/LogInWidget";
import AccountButton from "./component/AccountButton";
import SignUpWidget from "./component/SignUpWidget";
import Button from "./component/Button";

function L(text) {
  console.log(text);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoinBoardWidgetOpened: false,
      isLogInWidgetOpened: false,
      isSignUpWidgetOpened: true,
      isAuthorized: false
    };
  }

  handleJoinButtonClick(boardName) {
    L(boardName);
    const response = fetch(this.apiURL, {
          method: 'POST',
          mode: 'no-cors',
          dataType: 'json',
          credentials: 'omit',
          body: JSON.stringify({content: boardName}),
          mimeType: 'application/json',
          contentType: 'application/json',
          headers: {
            'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }
    );
    this.setState({isJoinBoardWidgetOpened: false});
  }

  isWrapperOpened() {
    return this.state.isJoinBoardWidgetOpened || this.state.isLogInWidgetOpened || this.state.isSignUpWidgetOpened;
  }

  renderAccount() {
    //localStorage.
    return this.state.isAuthorized
        ? <AccountButton onClick={() => this.setState({isLogInWidgetOpened: true})}/>
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
            <LogInWidget isOpened={this.state.isLogInWidgetOpened}
                         onClose={() => this.setState({isLogInWidgetOpened: false})}
                         onSignUpClick={() => {
                           this.setState({isLogInWidgetOpened: false, isSignUpWidgetOpened: true})
                         }}/>
            <SignUpWidget isOpened={this.state.isSignUpWidgetOpened}
                          onClose={() => this.setState({isSignUpWidgetOpened: false})}
                          onLogInClick={() => {
                            this.setState({isLogInWidgetOpened: true, isSignUpWidgetOpened: false})
                          }}/>
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