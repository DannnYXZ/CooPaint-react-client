import React from "react";
import "./ToolsMenu.css"
import ToolButton from "./ToolButton";

class ToolsMenu extends React.Component {
  render() {
    return (
        <ul className="tools-menu">
          <ToolButton/>
        </ul>
    );
  }
}

export default ToolsMenu;