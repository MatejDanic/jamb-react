import React, { Component } from "react";
import ScoreService from "../services/score.service";
import AuthService from "../services/auth.service";

export default class ScoreBoard extends Component {
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
    const dateFormat = new Intl.DateTimeFormat('UK', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return (
      <div className="container-custom">
        {currentUser && currentUser.roles.includes("ADMIN") && <div className="container-button">
          <button className="btn btn-danger button-admin" onClick={() => { if (window.confirm('Jeste li sigurni da izbrisati ovaj rezultat?')) this.deleteScore() }}>Izbriši</button>
        </div>}
        <div className="container-custom-inner">
          <h3>
            <strong>{score.value}</strong>
          </h3>

          <p>
            {score.user && <button className="btn btn-primary" onClick={() => { this.props.history.push("/users/" + score.user.id) }}>{score.user.username}</button>}
          </p>
          <p>
            <strong>ID: </strong>
            {score.id}
          </p>
          <p>
            <strong>Datum: </strong>
            {score.date && dateFormat.format(new Date(score.date))}
          </p>
        </div>
      </div>
    );
  }
}
