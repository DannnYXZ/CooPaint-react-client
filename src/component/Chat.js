import React from "react";
import "./Chat.css"
import Button from "./Button";
import TextInput from "./TextInput";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      me: "A",
      messages: [
        {
          from: "A",
          time: "12:46",
          img: "https://image.flaticon.com/icons/svg/145/145867.svg",
          body: "Hi, welcome to XXX! Blah blah... blah... yep."
        },
        {
          from: "B",
          time: "12:46",
          img: "https://image.flaticon.com/icons/svg/145/145867.svg",
          body: "Hi, welcome to XXX! Go ahead and send me a message."
        },
        {
          from: "A",
          time: "12:46",
          img: "https://image.flaticon.com/icons/svg/145/145867.svg",
          body: "Hi, welcome to XXX! Go ahead and send me a message."
        },
        {
          from: "B",
          time: "12:46",
          img: "https://image.flaticon.com/icons/svg/145/145867.svg",
          body: "Hi, welcome to XXX! Go ahead and send me a message."
        },
      ]
    };
    this.inputRef = React.createRef();
    this.socket = new WebSocket("ws://0.0.0.0:8089/api/chat");
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
    console.log("KEKE");
    this.socket.send(JSON.stringify(
        {
          action: "put-msg",
          message: {
            from: this.state.me,
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
        <div className={"msg " + (msg.from === this.state.me ? "right-msg" : "left-msg")}>
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
            <TextInput rref={this.inputRef} className="msger-input" placeholder="Enter your message..."
                       onEnter={this.send.bind(this)}/>
            <Button className="msger-send-btn" style={{display: "inline-block"}}
                    onClick={this.send.bind(this)}>Send</Button>
          </div>
        </div>
    );
  }
}

export default Chat;