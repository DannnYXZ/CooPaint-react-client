import React from "react";

class Drop extends React.Component {
  render() {
    //className="account-button"
    return (
        <ul>
          {this.props.children.map(e =>
              <li>
                {e}
              </li>
          )}
        </ul>
    );
  }
}

export default Drop;