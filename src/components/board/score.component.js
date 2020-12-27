import React, { Component } from "react";
// components
import Popup from "../popup/popup.component";
import PopupConfirm from "../popup/popup-confirm.component";
// services
import AuthService from "../../services/auth.service";
import ScoreService from "../../services/score.service";
// utils
import DateUtil from "../../utils/date.util";
// constants
import { dateFormatLong } from "../../constants/date-format";
// styles
import "./board.css";

export default class Score extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: undefined,
            score: "",
            messages: [],
            showPopup: false,
            showPopupConfirm: false
        };
        this.deleteScore = this.deleteScore.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.togglePopupConfirm = this.togglePopupConfirm.bind(this);
    }

    componentDidMount() {
        let currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser });

        ScoreService.getScore(this.props.match.params.scoreId)
            .then(response => {
                this.setState({ score: response });
            })
            .catch(response => {
                let messages = [];
                if (response.status && response.error) messages.push(response.status + " " + response.error);
                if (response.message) messages.push(response.message);
                this.togglePopup(messages);
            });
    }

    deleteScore() {
        this.togglePopupConfirm();
        ScoreService.deleteScore(this.props.match.params.scoreId)
            .then(response => {
                let messages = [];
                messages.push(response.message);
                this.togglePopup(messages);
                setTimeout(() => { this.props.history.push("/scores") }, 1000);
            })
            .catch(response => {
                let messages = [];
                if (response.status && response.error) messages.push(response.status + " " + response.error);
                if (response.message) messages.push(response.message);
                this.togglePopup(messages);
                this.togglePopupConfirm();
            });
    }

    togglePopup(messages) {
        this.setState({ showPopup: !this.state.showPopup, messages });
    }

    togglePopupConfirm() {
        this.setState({ showPopupConfirm: !this.state.showPopupConfirm });
    }

    render() {
        let currentUser = this.state.currentUser;
        let score = this.state.score;
        let messages = this.state.messages;
        return (
            <div className="container-custom">
                <div className="container-custom-inner">
                    <p>
                        {score.user && <button className="button-profile" onClick={() => { this.props.history.push("/users/" + score.user.id) }}>{score.user.username}</button>}
                    </p>
                    <h3>
                        <strong>Vrijednost: </strong>
                        {score.value}
                    </h3>
                    <p>
                        <strong>ID: </strong>
                        {score.id}
                    </p>
                    <p>
                        <strong>Datum: </strong>
                        {score.date && dateFormatLong.format(DateUtil.getDateFromLocalDateTime(score.date))}
                    </p>
                    {currentUser && currentUser.roles.includes("ADMIN") &&
                        <button className="delete-button" style={{ backgroundImage: "url(/images/misc/trash_closed.png)" }}
                            onClick={this.togglePopupConfirm} />}
                </div>
                {currentUser && currentUser.roles.includes("ADMIN") && <div className="container-button">
                </div>}
                {this.state.showPopupConfirm && <PopupConfirm text={["Jeste li sigurni da želite izbrisati ovaj rezultat?"]} onOk={this.deleteScore} onClose={this.togglePopupConfirm} />}
                {this.state.showPopup && <Popup text={messages} onOk={this.deleteScore} />}
            </div>
        );
    }
}
