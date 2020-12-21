import React, { Component } from "react";
import SockJsClient from "react-stomp";
import AuthService from "../../services/auth.service";
import { hourFormat } from "../../constants/date-format";
import "./chat.css";
import BASE_URL from "../../constants/api-url";

const url = BASE_URL + "/websocket-chat";

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined,
            messages: [],
            message: "",
            conversationId: "user-all"
        }
    }

    componentDidMount() {
        let currentUser = AuthService.getCurrentUser();
        let conversationId = this.state.conversationId;
        if (this.props.match.params.conversationId) {
            conversationId = this.props.match.params.conversationId;
        }
        if (currentUser) this.setState({ currentUser, conversationId });
        if (this.props.match.params.conversationId) {

        }
    }

    sendMessage = () => {
        if (this.state.message)
            this.clientRef.sendMessage("/app/" + this.state.conversationId, JSON.stringify({
                username: this.state.currentUser.username,
                userId: this.state.currentUser.id,
                value: this.state.message
            }));
        let message = "";
        document.getElementById("message").value = message;
        this.setState({ message });
    };

    render() {
        return (
            <div className="chat">
                <div className="messages">
                    <div>
                        {this.state.messages.map(msg => {
                            return (
                                <div key={msg.id}>
                                    [{msg.time}] -<button className="button-user" onClick={() => { this.props.history.push("/users/" + msg.userId) }}>{msg.username}</button>: {msg.value}
                                </div>)
                        })}
                    </div>
                    <SockJsClient url={url}
                        topics={["/topic/user"]}
                        onMessage={(msg) => {
                            let messages = this.state.messages;
                            msg.id = messages.length + 1;
                            msg.time = hourFormat.format(Date.now());

                            messages.push(msg);
                            this.setState({ messages });
                        }}
                        ref={(client) => {
                            this.clientRef = client
                        }} />
                </div>
                {this.state.currentUser && <div className="input">
                    <input className="input-field" id="message" onChange={(event) => { this.setState({ message: event.target.value }); }} />
                    <button className="btn input-button" onClick={this.sendMessage}>Send</button>
                </div>}
            </div>
        )
    }
}