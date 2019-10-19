import React from 'react';
import './App.css';
import JoinBoardWidget from "./component/JoinBoardWidget";
import Board from "./component/Board";
import WidgetsWrapper from "./component/WidgetsWrapper";
import LogInWidget from "./component/LogInWidget";
import AccountButton from "./component/AccountButton";

function L(text) {
  console.log(text);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoinBoardWidgetOpened: true,
      isLogInWidgetOpened: false,
      isRegisterWidgetOpened: false
    };
    this.apiURL = "http://localhost:8089/coopaint_war_exploded/put-text";
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

  openLogInWidget() {
    this.setState({isLogInWidgetOpened: true});
  }

  isWrapperOpened() {
    return this.state.isJoinBoardWidgetOpened || this.state.isLogInWidgetOpened;
  }

  render() {
    return (
        <div className="app">
          <WidgetsWrapper isOpened={this.isWrapperOpened()}>
            <JoinBoardWidget onJoinBoardClick={this.handleJoinButtonClick.bind(this)}
                             isOpened={this.state.isJoinBoardWidgetOpened}/>
            <LogInWidget isOpened={this.state.isLogInWidgetOpened}
                         onClose={() => this.setState({isLogInWidgetOpened: false})}
                         onRegisterClick={() => {
                           this.setState({isLogInWidgetOpened: false, isRegisterWidgetOpened: true})
                         }}/>
          </WidgetsWrapper>
          <div className="auth-toolbar">
            <AccountButton onClick={this.openLogInWidget.bind(this)}/>
          </div>
          <Board/>
        </div>
    );
  }
}

export default App;
// TODO: routing