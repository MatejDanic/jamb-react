import React, { Component } from "react";
import ScoreService from "../../../services/score.service";
import "./scoreboard.css";
import "../../../constants/colors.css";

export default class Scoreboard extends Component {

  constructor() {
    super();
    this.state = {
      scores: [],
      scoresToDisplay: []
    }
  }

  componentDidMount() {
    ScoreService.getScoreboard().then(
      response => {
        let scores = response.data;
        let scoresToDisplay = [];
        let i = 1;
        for (let score in response.data) {
          scoresToDisplay.push(response.data[score].username + ' ' + response.data[score].value)
          if (i === 3) break;
          else i += 1;
        }
        this.setState({ scores, scoresToDisplay })
      },
      error => {
        console.log(error.response.data);
      }
    );
  }

  render() {
    let scores = this.state.scoresToDisplay;
    return (
      <button className="scoreboard-button bg-light-pink" onClick={() => this.handleClick()}>
        <ul className="scoreboard">
          {scores.length > 0 ? scores.map(score =>
            <li key={score}>{score}</li>):
            <div className="scoreboard-empty">Lj<br />e<br />s<br />t<br />v<br />i<br />c<br />a</div>}
        </ul>
      </button>
    )
  }

  handleClick() {
    let scoreboard = "Najbolji rezultati ovaj tjedan:";
    let scores = this.state.scores;
    let i = 1;
    for (let key in scores) {
      scoreboard += "\n" + i + ". " + scores[key].username + ' - ' + scores[key].value;
      if (i === 10) break;
      else i += 1;
    }
    alert(scoreboard)
  }
}
