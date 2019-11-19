import React from "react";
import "./Main.css"
import "./BoardBrowser.css"
import Button from "./Button";
import TextInput from "./TextInput";
import ModalWidget from "./ModalWidget";
import {post, post_async} from "../model/Net";
import Error from "./Error";
import Tabs from "./Tabs";
import BoardCover from "./BoardCover";

class BoardBrowserWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      error: ''
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

  handleOnSubmit(e) {
    post("/api/sign-in", {
      email: this.refEmail.current.value,
      password: this.refPassword.current.value
    }, this.onSignedIn.bind(this), (error) => this.setState({error: error.message}));
    return false;
  }

  renderContent() {
    let resp;
    if (this.state.activeTab === 1) {
      //await post_async("/api/my-boards", {}, (json) => resp = json);
    }
    if (this.state.activeTab === 2) {
      //await post_async("/api/shared-boards", {}, (json) => resp = json);
    }
    //return resp.boards.map(b => <BoardCover id={b.id} name={b.name} img={b.img}/>);
    return (
        <div className="content-scroller">
          <div className="board-browser-content">
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
            <BoardCover id={5} name={'Test Board'} img={null}/>
          </div>
        </div>
    );
  }

  render() {
    return (
        <ModalWidget isOpened={this.props.isOpened} onClose={this.props.onClose} style={{maxHeight: "98%"}}>
          <div className="browser-tabs">
            <Tabs activeTab={this.state.activeTab}>
              <span></span>
              <Button className="btn" onClick={this.onMyBoards.bind(this)}>My boards</Button>
              <Button className="btn" onClick={this.onShared.bind(this)}>Shared with me</Button>
            </Tabs>
          </div>
          <div className="board-browser">
            {this.renderContent()}
          </div>
        </ModalWidget>
    );
  }
}

export default BoardBrowserWidget;