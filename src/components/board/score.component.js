import React, { Component } from "react";
// services
import AuthService from "../../services/auth.service";
import ScoreService from "../../services/score.service";
// utils
import DateUtil from "../../utils/date.util";
// constants
import { dateFormatLong } from "../../constants/date-format";

export default class Score extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      score: ""
    };
  }

  componentDidMount() {
    let currentUser = AuthService.getCurrentUser();
    if (currentUser) this.setState({ currentUser });
    
    ScoreService.getScore(this.props.match.params.scoreId).then(
      response => {
        this.setState({ score: response.data });
      },
      error => {
        // console.log(error);
      }
    );
  }

  deleteScore() {
    ScoreService.deleteScore(this.props.match.params.scoreId).then(
      response => {
        this.props.history.push("/scores");
      },
      error => {
        // console.log(error);
      }
    );
  }

  render() {
    let currentUser = this.state.currentUser;
    let score = this.state.score;
    return (
      <div className="container-custom">
        <div className="container-custom-inner">
          <h3>
            <strong>Vrijednost: </strong>
            {score.value}
          </h3>
          <p>
            <strong>Korisnik: </strong>
            {score.user && <button className="btn btn-primary" onClick={() => { this.props.history.push("/users/" + score.user.id) }}>{score.user.username}</button>}
          </p>
          <p>
            <strong>ID: </strong>
            {score.id}
          </p>
          <p>
            <strong>Datum: </strong>
            {score.date && dateFormatLong.format(DateUtil.getDateFromLocalDateTime(score.date))}
          </p>
        </div>
          {currentUser && currentUser.roles.includes("ADMIN") && <div className="container-button">
            <button className="btn btn-danger button-admin" onClick={() => { if (window.confirm('Jeste li sigurni da izbrisati ovaj rezultat?')) this.deleteScore() }}>Izbriši</button>
          </div>}
        </div>
    );
  }
}
