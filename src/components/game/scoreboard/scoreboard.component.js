import React, { Component } from "react";
import ScoreService from "../../../services/score.service";
import Popup from "../../popup/popup.component";
import "./scoreboard.css";
import "../../../constants/colors.css";

export default class Scoreboard extends Component {

	constructor() {
		super();
		this.state = {
			scores: [],
			scoresToDisplay: [],
			scoreboard: [],
			showPopup: false
		}
		this.togglePopup = this.togglePopup.bind(this);
	}

	componentDidMount() {
		ScoreService.getScoreboard().then(
			response => {
				let scores = response.data;
				let scoresToDisplay = [];
				let i = 1;
				for (let score in response.data) {
					scoresToDisplay.push(i + ". " + response.data[score].username)
					if (i === 3) break;
					else i += 1;
				}
				this.setState({ scores, scoresToDisplay })
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
		let scores = this.state.scoresToDisplay;
		let scoreboard = this.state.scoreboard;
		return (
			<div className="scoreboard-button bg-light-pink" onClick={() => this.handleClick()} >
				<ul className="scoreboard">
					{scores.length > 0 ? scores.map(score =>
						<li key={score}>{score}</li>) :
						<div className="scoreboard-empty">---<br />---<br />---<br />---<br />---</div>}
				</ul>
				{this.state.showPopup && <Popup text={scoreboard} onOk={this.togglePopup} />}
			</div>
		)
	}

	handleClick() {
		let scoreboard = ["Najbolji rezultati ovaj tjedan:"];
		let scores = this.state.scores;
		let i = 1;
		for (let key in scores) {
			scoreboard.push(i + ". " + scores[key].username + ' - ' + scores[key].value);
			if (i === 10) break;
			else i += 1;
		}
		if (scores.length > 0) {
			this.setState({ scoreboard });
			this.togglePopup();
		}
	}
}
