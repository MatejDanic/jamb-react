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
		ScoreService.getScoreboard()
			.then(response => {
				let scores = response.scores;
				let scoresToDisplay = [];
				let i = 1;
				for (let key in scores) {
					scoresToDisplay.push(i + ". " + scores[key].username)
					if (i === 3) break;
					else i += 1;
				}
				this.setState({ scores, scoresToDisplay })
			}).catch(response => {
				let messages = [];
				if (response.status && response.error) messages.push(response.status + " " + response.error);
				if (response.message) messages.push(response.message);
				this.togglePopup(messages);
			}
			);
	}

	togglePopup(scoreboard) {
		this.setState({ showPopup: !this.state.showPopup, scoreboard });
	}

	render() {
		let scores = this.state.scoresToDisplay;
		let scoreboard = this.state.scoreboard;
		return (
			<div className="scoreboard-button bg-lightpink" onClick={() => this.handleClick()} >
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
		let scoreboard = [];
		let scores = this.state.scores;
		if (scores && scores.length > 0) {
			scoreboard.push("Najbolji rezultati ovaj tjedan:");
			let i = 1;
			for (let key in scores) {
				scoreboard.push(i + ". " + scores[key].username + ' - ' + scores[key].value);
				if (i === 10) break;
				else i += 1;
			}
		} else {
			scoreboard.push("Nema postignutih rezultata u ovom tjednu");
		}

		this.togglePopup(scoreboard);
	}
}
