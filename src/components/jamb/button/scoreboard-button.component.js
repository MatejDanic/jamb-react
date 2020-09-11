import React, { Component } from "react";
import ScoreService from "../../../services/score.service";
import "./button.css"

export default class ScoreboardButton extends Component {

  render() {
    return (
      <button className="form-button scoreboard" onClick={() => this.handleClick()}>Lj e s t v i c a</button>
    )
  }

  handleClick() {
    ScoreService.getScoreboard().then(
      response => {
        let scoreboard = response.data;
        let text = '';
        let i = 1;
        for (let score in scoreboard) {
          text += i + '. ' + scoreboard[score].username + ' - ' + scoreboard[score].value + '\n';
          i += 1;
        }
        alert('Najbolji rezultati ovaj tjedan:\n' + text);
      },
      error => {
        console.log(error);
      }
    );
  }
}
