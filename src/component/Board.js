import React from "react";
import './Board.css'
import Canvas from "./Canvas";
import ToolsMenu from "./ToolsMenu";
import {post} from "../model/Net";
import {method} from "../model/config";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      canvas: [],
      isAdmin: false
    };
  }

  componentDidMount() {
  }

  onMessage(event) {
    console.log("board got message");
    console.log(event.data);
  }

  create() {
    // POST /boards
    post("/boards", {}, (board) => this.setState({
      canvas: board.canvas
    }));
  }

  read() {
    // GET /boards/{id}
  }

  update() {
    // PUT /boards/{id}/element
  }

  delete() {
    // DELETE /boards/{id}
  }

  get(boardId) {
    // get /boards/{id}
    post("/get-board", {id: this.state.id}, (board) => this.setState({
      canvas: board.canvas
    }));
  }

  save() {
    post("/save-board", {id: this.state.id}, (board) => this.setState({
      canvas: board.canvas
    }));
  }

  send(jelem) {
    this.socket.send(JSON.stringify(jelem));
  }


  connectToBoard(boardUUID) {
    this.props.ws.send(JSON.stringify(
        {
          method: method.GET,
          url: `/chat/${boardUUID}`
        }
    ));
    this.readBoardHistory();
  }

  readBoardHistory() {
    this.props.ws.send(JSON.stringify(
        {
          method: method.GET,
          url: `/board/${this.state.chatUUID}/drawings`
        }
    ));
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.ws && this.props.ws) {
      console.log("chat got valid ws");
      this.props.ws.addEventListener("message", this.onMessage.bind(this));
      // this.connectToBoard(this.props.chatUUID);
    }
  }

  render() {
    return (
        <div className="main-board">
          <ToolsMenu/>
          <Canvas/>
        </div>
    );
  }
}

export default Board;