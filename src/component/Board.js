import React from "react";
import './Board.css'
import Canvas from "./Canvas";
import ToolsMenu from "./ToolsMenu";
import {request} from "../model/Net";
import {method} from "../model/config";

export const TOOL = {NONE: "NULL", LINE: "LINE"};
const STATE_DRAW = {IDLE: 0, DRAW: 1};
const STATE_MODE = {OFFLINE: 0, ONLINE: 1};

class Board extends React.Component {
  FSM_DRAW = STATE_DRAW.IDLE;
  FSM_MODE = null;
  tool = TOOL.LINE;
  tmpShape = {
    type: null,
    params: []
  };
  pushedState = false;

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
    this.canvasRef = React.createRef();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  switchBoardMode(){
    this.FSM_MODE = this.props.boardUUID
        ? STATE_MODE.ONLINE
        : STATE_MODE.OFFLINE;
  }

  componentDidMount() {
    this.switchBoardMode();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.ws && this.props.ws) {
      console.log("board got valid ws");
      this.props.ws.addEventListener("message", this.onMessage.bind(this));
    }
    if (this.props.boardUUID !== prevProps.boardUUID && this.props.boardUUID) {
      this.readBoardHistory();
    }
    this.switchBoardMode();
  }

  onMessage(event) {
    let json = JSON.parse(event.data);
    switch (json.action) {
      case "add-elements":
        if (!this.pushedState) {
          this.send(this.state.canvas);
          this.pushedState = true;
        }
        this.state.canvas.push.apply(this.state.canvas, json.elements);
        this.canvasRef.current.draw(json.elements);
        // TODO: remove duplicates from canvas
        break;
    }
  }

  create() {
    // POST /snapshots
    request("/snapshots", {}, (board) => this.setState({
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

  delete() {
    // DELETE /snapshots/{id}
  }

  save() {
    request(`/board/${this.props.boardUUID}`, (board) => this.setState({
      //canvas: board.canvas
    }));
  }

  send(elements) {
    this.props.ws.send(JSON.stringify(
        {
          method: method.POST,
          url: `/board/${this.props.boardUUID}/elements`,
          body: elements // array
        }));
  }

  readBoardHistory() {
    this.state.canvas = [];
    this.canvasRef.current.resize();
    this.props.ws.send(JSON.stringify(
        {
          method: method.GET,
          url: `/board/${this.props.boardUUID}/elements`
        }
    ));
  }

  onMouseDown() {
    this.FSM_DRAW = STATE_DRAW.DRAW;
    switch (this.tool) {
      case TOOL.LINE:
        this.tmpShape.type = this.tool;
        this.state.canvas.push(this.tmpShape); // then appending points to it
        break;
    }
  }

  onMouseMove({nativeEvent}) {
    console.log(this.FSM_DRAW);
    switch (this.FSM_DRAW) {
      case STATE_DRAW.DRAW:
        const {clientX, clientY} = nativeEvent;
        this.tmpShape.params.push(clientX);
        this.tmpShape.params.push(clientY);
        this.canvasRef.current.draw([this.tmpShape]); // avoid state change
        break;
    }
  }

  onMouseUp() {
    console.log(this.state.canvas);
    // send shape
    if (this.FSM_MODE === STATE_MODE.ONLINE) {
      this.send([this.tmpShape]);
    }
    this.tmpShape = {
      params: []
    };
    this.FSM_DRAW = STATE_DRAW.IDLE;
    //this.forceUpdate();
  }

  render() {
    return (
        <div className="main-board" ref={this.boardDiv}
             onMouseDown={this.onMouseDown}
             onMouseUp={this.onMouseUp}
             onMouseMove={this.onMouseMove}
        >
          <ToolsMenu/>
          <Canvas ref={this.canvasRef}
                  elements={this.state.canvas}
                  onResize={() => {
                    console.log(this.canvasRef.current);
                    if (this.canvasRef.current)
                      this.canvasRef.current.draw(this.state.canvas);
                  }
                  }/>
        </div>
    );
  }
}

export default Board;