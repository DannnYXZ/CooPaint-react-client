import React from "react";
import './Board.css'
import Canvas from "./Canvas";
import ToolsMenu from "./ToolsMenu";

class Board extends React.Component {
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