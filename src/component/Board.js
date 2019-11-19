import React from "react";
import './Board.css'
import Canvas from "./Canvas";
import ToolsMenu from "./ToolsMenu";
import {post} from "../model/Net";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      canvas: [],
      isAdmin: false
    };
    this.socket = new WebSocket(`ws://${window.location.host}/coopaint/board`);
    this.socket.onmessage = this.onMessage.bind(this);
  }

  onMessage() {

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

  componentDidMount() {
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