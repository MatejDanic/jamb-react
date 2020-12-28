import React, { Component } from "react";
// styles
import "./chat.css";

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined,
            messages: this.props.messages,
            message: "",
        }

        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage() {
        let message = this.state.message;
        if (message) {
            this.props.onSendMessage("/text", message);
            message = "";
            this.setState({ message });
        }
    }

    render() {
        let messages = this.state.messages;
        let message = this.state.message;
        return (
            <div className="chat">
                <div className="messages">
                    <div>
                        {messages.map((message, index) => <div key={index}>[{message.time}] - {message.username}: {message.message}</div>)}
                    </div>
                </div>
                <div className="input">
                    <input className="input-field" id="message" onChange={(event) => { this.setState({ message: event.target.value }); }} value={message} />
                    <button className="input-button" onClick={this.sendMessage}>Send</button>
                </div>
            </div>
        )
    }
}