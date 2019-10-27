import React from "react";
import "./Button.css"
import "./Tabs.css"

class Tabs extends React.Component {
  render() {
    return (
        <ul className="tabs">
          {this.props.children.map((e, i) =>
              <li className={"tab-item " + (i === this.props.activeTab ? "tab-active" : "")}>
                {e}
              </li>
          )}
        </ul>
    );
  }
}

export default Tabs;