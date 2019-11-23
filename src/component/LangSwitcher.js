import Button from "./Button";
import Drop from "./Drop";
import React from "react";
import "./Button.css"

class LangSwitcher extends React.Component {
  render() {
    return (
        <div className="toolbar-bl">
          <Button className="rnd-btn"
                  onClick={() => this.props.onClick()}
                  img="globe.svg">
            <Drop style={{top: 3, left: 50}} className="drop-hr" isOpened={this.props.isOpened}>
              <Button className="btn trans-btn" onClick={() => this.props.onChange("EN")}>EN</Button>
              <Button className="btn trans-btn" onClick={() => this.props.onChange("RU")}>RU</Button>
            </Drop>
          </Button>
        </div>
    );
  }
}

export default LangSwitcher;