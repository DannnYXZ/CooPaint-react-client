import React from "react";
import "./Chat.css"
import Button from "./Button";
import TextInput from "./TextInput";
import MyContext from "../model/Context";

class Chat extends React.Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          from: "A",
          time: "12:46",
          img: "",
          body: "Hi, welcome to shared board! Blah blah... blah... yep."
        },
        {
          from: "B",
          time: "12:46",
          img: "",
          body: "Hi..."
        },
      ]
    };
    this.inputRef = React.createRef();
    this.socket = new WebSocket(`ws://${window.location.host}/api/chat`);
    this.socket.onmessage = this.onMessage.bind(this);
  }

  onMessage(event) {
    let json = JSON.parse(event.data);
    switch (json.action) {
      case "put-msg":
        this.setState({messages: this.state.messages.concat([json.message])});
        break;
      case "remove-msg":

        break;
    }
    console.log(event.data);
  }

  send() {
    this.socket.send(JSON.stringify(
        {
          action: "put-msg",
          message: {
            from: this.props.me || "Anonymus",
            to: "B",
            time: "12:34",
            body: this.inputRef.current.value
          }
        }
    ));
    this.inputRef.current.value = '';
  }

  renderMessage(msg) {
    return (
        <div className={"msg " + (msg.from === this.props.me ? "right-msg" : "left-msg")}>
          <div className="msg-img" style={{backgroundImage: `"url(${msg.img})"`}}/>
          <div className="msg-bubble">
            <div className="msg-info">
              <div className="msg-info-name">{msg.from}</div>
              <div className="msg-info-time">{msg.time}</div>
            </div>
            <div className="msg-text">
              {msg.body}
            </div>
          </div>
        </div>
    );
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior: "smooth"});
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    let t = this.context;
    return (
        <div className="msger" onClick={e => e.stopPropagation()}>
          <header className="msger-header">
            <div className="msger-header-title">
            </div>
            <div className="msger-header-options">
            </div>
          </header>
          <main className="msger-chat">
            {this.state.messages.map(msg => this.renderMessage(msg))}
            <div style={{float: "left", clear: "both"}} ref={(el) => {
              this.messagesEnd = el;
            }}/>
          </main>
          <div className="msger-inputarea">
            <TextInput rref={this.inputRef} className="msger-input" placeholder={t["enter.your.message"]}
                       onEnter={this.send.bind(this)}/>
            <Button className="msger-send-btn" style={{display: "inline-block"}}
                    onClick={this.send.bind(this)}>{t["send"]}</Button>
          </div>
        </div>
    );
  }
}

export default Chat;