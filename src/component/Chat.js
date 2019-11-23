import React from "react";
import "./Chat.css"
import Button from "./Button";
import TextInput from "./TextInput";
import i18nContext from "../model/i18nContext.js";

const method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
};

class Chat extends React.Component {
  static contextType = i18nContext;

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
      ],
      user: props.user || {},
      chatUUID: "123e4567-e89b-12d3-a456-426655440000"
    };
    this.inputRef = React.createRef();
    this.socket = new WebSocket(`ws://${window.location.host}/coopaint/chat`);
    this.socket.onopen = () => this.connectToChat(this.state.chatUUID);
    this.socket.onmessage = this.onMessage.bind(this);
  }

  readChatHistory() {
    this.socket.send(JSON.stringify(
        {
          method: method.GET,
          url: `/chat/${this.state.chatUUID}/messages`
        }
    ));
  }

  connectToChat(chatUUID) {
    this.socket.send(JSON.stringify(
        {
          method: method.GET,
          url: `/chat/${chatUUID}`
        }
    ));
    this.readChatHistory();
  }

  sendMessages() {
    this.socket.send(JSON.stringify(
        {
          method: method.POST,
          url: `/chat/${this.state.chatUUID}/messages`,
          body: [{
            from: this.props.user.name || "Anonymus",
            to: "B",
            time: "12:34",
            body: this.inputRef.current.value
          }]
        }
    ));
    this.inputRef.current.value = '';
  }

  onMessage(event) {
    let json = JSON.parse(event.data);
    switch (json.action) {
      case "remove-messages":

        break;
      case "add-messages":
        this.setState({messages: this.state.messages.concat(json.messages)});
        break;
      case "connect":
        this.setState({chatUUID: json.id});
        break;
    }
    console.log(event.data);
  }

  renderMessage(msg) {
    return (
        <div className={"msg " + (msg.from === this.props.user.name ? "right-msg" : "left-msg")} key={msg.id}>
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
    console.log("chat context");
    console.log(t);
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
                       onEnter={this.sendMessages.bind(this)}
                       style={{height: 40}}/>
            <Button className="msger-send-btn" style={{display: "inline-block"}}
                    onClick={this.sendMessages.bind(this)}>{t["send"]}</Button>
          </div>
        </div>
    );
  }
}

export default Chat;