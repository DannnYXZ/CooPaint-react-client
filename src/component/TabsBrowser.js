import React from "react";
import i18nContext from "../model/i18nContext";
import Tabs from "./Tabs";

class TabsBrowser extends React.Component {
  static contextType = i18nContext;

  onTabSwitch(index) {
    //this.setState({currentTab: index});
  }

  render() {
    let t = this.context;
    return (
        <div className="tab-browser">
          <Tabs onSwitch={(index) => this.onTabSwitch(index)}>
            {this.props.tabNames}
          </Tabs>
          {this.props.children.map((content, i) => i === this.props.activeTab
              ? <div key={i}>{content}</div>
              : null)
          }
        </div>
    );
  }
}

export default TabsBrowser;