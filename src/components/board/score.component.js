import React, { Component } from "react";
import ScoreService from "../../services/score.service";
import AuthService from "../../services/auth.service";
import { dateFormatLong } from "../../constants/date-format";
import DateUtil from "../../utils/date.util";

export default class Score extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      content: "",
    };
  }

  componentDidMount() {
    this.setState({ currentUser: AuthService.getCurrentUser() });
    ScoreService.getScore(this.props.match.params.scoreId).then(
      response => {
        this.setState({ content: response.data });
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteScore() {
    ScoreService.deleteScore(this.props.match.params.scoreId).then(
      response => {
        this.props.history.push("/scores");
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    let score = this.state.content;
    let currentUser = this.state.currentUser;
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
          {currentUser && currentUser.roles.includes("ADMIN") && <div className="container-button">
            <button className="btn btn-danger button-admin" onClick={() => { if (window.confirm('Jeste li sigurni da izbrisati ovaj rezultat?')) this.deleteScore() }}>Izbriši</button>
          </div>}
        </div>
      </div>
    );
  }
}
