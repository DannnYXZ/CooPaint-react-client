import React from "react";
import "./Main.css"
import "./BoardBrowser.css"
import Button from "./Button";
import ModalWidget from "./ModalWidget";
import Tabs from "./Tabs";
import BoardCover from "./BoardCover";
import {request} from "../model/Net";
import {method} from "../model/config";
import i18nContext from "../model/i18nContext";

class BoardManagerWidget extends React.Component {
  static contextType = i18nContext;

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      error: '',
      snapshots: []
    };
    this.refEmail = React.createRef();
    this.refPassword = React.createRef();
  }

  onSignedIn(user) {
    this.props.onSignedIn(user);
    this.refEmail.current.value = '';
    this.refPassword.current.value = '';
    this.setState({error: ''});
  }

  onMyBoards() {
    this.setState({activeTab: 1});
  }

  onShared() {
    this.setState({activeTab: 2});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpened && !prevProps.isOpened) {
      this.readMyBoards();
    }
    if (this.props.isOpened === false && prevProps.isOpened) {
      this.setState({snapshots: []});
    }
  }

  readMyBoards() {
    request(method.GET, `/snapshot/all`, null,
        (json) => this.setState({snapshots: json}));
  }

  deleteBoard(board) {
    request(method.DELETE, `/board/${board.uuid}`, null, this.readMyBoards.bind(this));
  }

  renderContent() {
    let resp;
    if (this.state.activeTab === 1) {
      // 1
    }
    if (this.state.activeTab === 2) {
      // 2
    }
    // return resp.snapshots.map(b => <BoardCover id={b.id} name={b.name} img={b.img}/>);
    return (
        <div className="content-scroller">
          <div className="board-browser-content">
            {this.state.snapshots.map((s, i) => <BoardCover id={s.board.uuid}
                                                            name={s.board.name}
                                                            img={null}
                                                            onDelete={() => this.deleteBoard(s.board)}
                                                            onClick={() => this.props.onOpen(s)}
                                                            key={i}/>)}
          </div>
        </div>
    );
  }

  render() {
    let t = this.context;
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={this.props.onClose} style={{maxHeight: "98%"}}>
          <div className="browser-tabs">
            <Tabs activeTab={this.state.activeTab}>
              {[<Button className="btn" onClick={this.onMyBoards.bind(this)}>{t["boards.my"]}</Button>]}
              {/*<Button className="btn" onClick={this.onShared.bind(this)}>Shared with me</Button>*/}
            </Tabs>
          </div>
          <div className="board-browser">
            {this.renderContent()}
          </div>
        </ModalWidget>
    );
  }
}

export default BoardManagerWidget;