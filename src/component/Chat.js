import React from "react";
import "./Chat.css"
import Button from "./Button";
import TextInput from "./TextInput";
import i18nContext from "../model/i18nContext.js";
import {method} from "../model/config";

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
        }
      ],
      user: props.user || {}
    };
    this.inputRef = React.createRef();
  }

  onMessage(event) {
    let json = JSON.parse(event.data);
    switch (json.action) {
      case "add-messages":
        this.setState({messages: this.state.messages.concat(json.messages)});
        break;
    }
    console.log(event.data);
  }

  readChatHistory() {
    try {
      this.props.ws.send(JSON.stringify(
          {
            method: method.GET,
            url: `/chat/${this.props.chatUUID}/messages`
          }
      ));
    } catch (e) {
      console.log(e);
    }
  }

  sendMessages() {
    try {
      this.props.ws.send(JSON.stringify(
          {
            method: method.POST,
            url: `/chat/${this.props.chatUUID}/messages`,
            body: [{
              from: this.props.user.name || "Anonymus",
              to: "B",
              time: "12:34",
              body: this.inputRef.current.value
            }]
          }
      ));
    } catch (e) {
      console.log(e);
    }
    this.inputRef.current.value = '';
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior: "smooth"});
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("chat did update");
    console.log(prevProps);
    console.log(this.props);
    if (!prevProps.chatUUID && this.props.chatUUID) {
      console.log("chat got valid ws");
      this.props.ws.addEventListener("message", this.onMessage.bind(this));
      this.readChatHistory();
    }
    this.scrollToBottom();
    this.inputRef.current.focus();
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