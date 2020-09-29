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
        let scores = [];
        let i = 1;
        for (let score in response.data) {
          scores.push(response.data[score].username + ' ' + response.data[score].value)
          if (i === 3) break;
          else i += 1;
        }
        this.setState({ scores: response.data, scoresToDisplay: scores })
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    let scores = this.state.scoresToDisplay;
    return (
      <button className="scoreboard-button bg-light-pink" onClick={() => this.handleClick()}>
        <ul className="scoreboard">
            {scores && scores.map(score =>
              <li key={score}>{score}</li>)}
          </ul>
      </button>
    )
  }

  handleClick() {
    let scoreboard = "Najbolji rezultati ovaj tjedan:";
    let i = 1;
    for (let score in this.state.scores) {
      scoreboard += "\n" + i + ". " + this.state.scores[score].username + ' - ' + this.state.scores[score].value;
      if (i === 10) break;
      else i += 1;
    }
    alert(scoreboard)
  }
}
