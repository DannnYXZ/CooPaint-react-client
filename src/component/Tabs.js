import React from "react";
import "./Button.css"
import "./Tabs.css"

class Tabs extends React.Component {
  // TODO: callback on selected

  onTabClick(index) {
    if (this.props.onSwitch) this.props.onSwitch(index);
  }

  render() {
    return (
        <ul className="tabs">
          {this.props.children.map((e, i) =>
              <li className={"tab-item " + (i === this.props.activeTab ? "tab-active" : "")}
                  key={i}
                  onClick={() => this.onTabClick(i)}>
                {e}
              </li>
          )}
        </ul>
    );
  }
}

export default Tabs;