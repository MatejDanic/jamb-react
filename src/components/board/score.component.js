import React, { Component } from "react";
// services
import AuthService from "../../services/auth.service";
import ScoreService from "../../services/score.service";
// utils
import DateUtil from "../../utils/date.util";
// constants
import { dateFormatLong } from "../../constants/date-format";
// styles
import "./board.css";
import Popup from "../popup/popup.component";

export default class Score extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentUser: undefined,
			score: "",
			messages: ["Jeste li sigurni da želite izbrisati ovaj rezultat?"],
			showPopup: false
		};
		this.togglePopup = this.togglePopup.bind(this);
		this.deleteScore = this.deleteScore.bind(this);
	}

	componentDidMount() {
		let currentUser = AuthService.getCurrentUser();
		if (currentUser) this.setState({ currentUser });

		ScoreService.getScore(this.props.match.params.scoreId).then(
			response => {
				this.setState({ score: response.data });
			},
			error => {
				console.log(error.response && error.response.data);
			}
		);
	}

	deleteScore() {
		ScoreService.deleteScore(this.props.match.params.scoreId).then(
			response => {
				this.props.history.push("/scores");
			},
			error => {
				console.log(error.response && error.response.data);
			}
		);
	}

	togglePopup() {
		this.setState({ showPopup: !this.state.showPopup });
	}

	render() {
		let currentUser = this.state.currentUser;
		let score = this.state.score;
		let messages = this.state.messages;
		return (
			<div className="container-custom">
				<div className="container-custom-inner">
					<p>
						{score.user && <button className="button-user" onClick={() => { this.props.history.push("/users/" + score.user.id) }}>{score.user.username}</button>}
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
							onClick={this.togglePopup} />}
				</div>
				{currentUser && currentUser.roles.includes("ADMIN") && <div className="container-button">
				</div>}
				{this.state.showPopup && <Popup text={messages} onOk={this.deleteScore} onClose={this.togglePopup} />}
			</div>
		);
	}
}
