import React from "react";
import './Board.css'
import Canvas from "./Canvas";
import ToolsMenu from "./ToolsMenu";
import {request} from "../model/Net";
import {method} from "../model/config";
import {BOARD_MODE} from "./Editor";

export const TOOL = {NONE: "NULL", LINE: "LINE"};
const STATE_DRAW = {IDLE: 0, DRAW: 1};

class Board extends React.Component {
  FSM_DRAW = STATE_DRAW.IDLE;
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
    this.canvasRef = React.createRef();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.ws && this.props.ws) {
      console.log("board got valid ws");
      this.props.ws.addEventListener("message", this.onMessage.bind(this));
    }
  }

  onMessage(event) {
    let json = JSON.parse(event.data);
    switch (json.action) {
      case "add-elements":
        this.state.canvas.push.apply(this.state.canvas, json.elements);
        this.canvasRef.current.draw(json.elements);
        // TODO: remove duplicates from canvas
        break;
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

  readBoard(uuid) {
    this.state.canvas = [];
    this.canvasRef.current.resize(); // aka clear ^____^
    this.props.ws.send(JSON.stringify(
        {
          method: method.GET,
          url: `/board/${uuid}/elements`
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
    // send shape
    if (this.props.mode === BOARD_MODE.ONLINE) {
      this.send([this.tmpShape]);
    }
    // detach from filled shape
    this.tmpShape = {
      params: []
    };
    this.FSM_DRAW = STATE_DRAW.IDLE;
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