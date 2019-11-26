import React from "react";
import './Board.css'
import Canvas from "./Canvas";
import ToolsMenu from "./ToolsMenu";
import {post} from "../model/Net";
import {method} from "../model/config";
import _ from "lodash";

export const TOOL = {NONE: "none", LINE: "line"};
const FSM = {IDLE: 0, DRAW: 1};

class Board extends React.Component {
  FSM = FSM.IDLE;
  tool = TOOL.LINE;
  tmpShape = {
    type: null,
    params: []
  };

  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      canvas: [],
      w: 0,
      h: 0,
      isAdmin: false,
    };
    this.boardDiv = React.createRef();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.refineCanvas.bind(this));
    this.refineCanvas();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.ws && this.props.ws) {
      console.log("chat got valid ws");
      this.props.ws.addEventListener("message", this.onMessage.bind(this));
      // this.connectToBoard(this.props.chatUUID);
    }
  }

  refineCanvas() {
    this.setState({
      w: this.boardDiv.current.offsetWidth,
      h: this.boardDiv.current.offsetHeight
    });
  }

  onMessage(event) {
    console.log("board got message");
    // console.log(event.data);
  }

  create() {
    // POST /boards
    post("/boards", {}, (board) => this.setState({
      //canvas: board.canvas
    }));
    // target="_blank"
  }

  read() {
    try {
      this.props.ws.send(JSON.stringify(
          {
            method: method.GET,
            url: `/board/${this.props.chatUUID}`
          }
      ));
    } catch (e) {
      console.log(e);
    }
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
    this.props.ws.send(JSON.stringify(
        {
          method: method.POST,
          url: `/board/${this.props.boardUUID}/elements`,
          body: jelem
        }));
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

  onMouseDown() {
    this.FSM = FSM.DRAW;
    switch (this.tool) {
      case TOOL.LINE:
        this.tmpShape.type = this.tool;
        break;
    }
  }

  onTouchStart(e) {
    this.FSM = FSM.DRAW;
    switch (this.tool) {
      case TOOL.LINE:
        this.tmpShape.type = this.tool;
        break;
    }
    e.preventDefault();
  }

  onMouseMove({nativeEvent}) {
    console.log(this.FSM);
    switch (this.FSM) {
      case FSM.DRAW:
        const {clientX, clientY} = nativeEvent;
        this.tmpShape.params.push(clientX);
        this.tmpShape.params.push(clientY);
        break;
    }
  }

  onTouchMove(e) {
    console.log(this.FSM);
    switch (this.FSM) {
      case FSM.DRAW:
        this.tmpShape.params.push(e.x);
        this.tmpShape.params.push(e.y);
        break;
    }
    e.preventDefault();
  }

  onMouseUp() {
    console.log(this.state.canvas);
    // send shape
    this.send(this.tmpShape);
    this.state.canvas.push(_.cloneDeep(this.tmpShape));
    this.tmpShape.params = [];
    this.FSM = FSM.IDLE;
    this.forceUpdate();
  }

  render() {
    return (
        <div className="main-board" ref={this.boardDiv} res={() => this.refineCanvas.bind(this)}
             onMouseDown={this.onMouseDown}
             onMouseUp={this.onMouseUp}
             onMouseMove={this.onMouseMove}
             onTouchStart={this.onTouchStart}
             onTouchMove={this.onTouchMove}>
          <ToolsMenu/>
          <Canvas elements={this.state.canvas}/>
        </div>
    );
  }
}

export default Board;