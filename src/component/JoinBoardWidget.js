import React from "react";
import "./Main.css"
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";

class JoinBoardWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardName: ""
    }
  }

  handleJoinBoardClick() {
    this.props.onJoinBoardClick(this.state.boardName);
    console.log(this.state.boardName);
  }

  render() {
    return (
        <ModalWidget isOpened={this.props.isOpened}>
          <h1>Join Shared Board XXX</h1>
          <div className="hr-section">
            <TextInput placeholder="Enter board name"
                       onChangeText={(text) => this.setState({boardName: text})}
                       onEnter={this.handleJoinBoardClick.bind(this)}
                       className="van-input mr1"/>
            <Button onClick={this.handleJoinBoardClick.bind(this)}
                    className="btn green-btn">
              SUBMIT
            </Button>
          </div>
        </ModalWidget>
    );
  }
}

export default JoinBoardWidget;