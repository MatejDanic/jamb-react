import React, { Component } from "react";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { dateFormatLong } from "../misc/date-format";
import DateUtil from "../utils/date.util";
import ScoreUtil from "../utils/score.util";
import ScoreListBoard from "./board-score-list.component";

export default class UserBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      content: "",
      userIsAdmin: false
    };
  }

  componentDidMount() {
    this.setState({ currentUser: AuthService.getCurrentUser() }, () => {
      let userId = this.props.userId ? this.props.userId : this.props.match.params.userId;
      UserService.getUser(userId).then(
        response => {
          this.setState(state => {
            for (let key in response.data.roles) {
              if (response.data.roles[key].label === "ADMIN") state.userIsAdmin = true;
            }
          })
          this.setState({ content: response.data });
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  deleteUser() {
    UserService.deleteUser(this.props.match.params.userId).then(
      response => {
        this.props.history.push("/users");
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    let user = this.state.content;
    let currentUser = this.state.currentUser;
    let scores = user.scores;
    let totalScore =  ScoreUtil.getTotalScore(scores);
    let highScore = ScoreUtil.getHighScore(scores);

    return (
      <div className="container-custom">
        {currentUser && currentUser.roles.includes("ADMIN") && !this.state.userIsAdmin && <div className="container-button">
          <button className="btn btn-danger button-admin" onClick={() => { if (window.confirm('Jeste li sigurni da izbrisati ovog korisnika?')) this.deleteUser() }}>Izbriši</button>
        </div>}
        <div className="container-custom-inner">
          <h3>
            <strong>{user.username}</strong>
          </h3>
          <p>
            <strong>ID: </strong>
            {user.id}
          </p>
          <strong>Uloge:</strong>
          <ul>
            {user.roles &&
              user.roles.map((role, id) => <li key={id}>{role.label}</li>)}
          </ul>
          <p><strong>Posljednja igra: </strong>{scores && scores.length === 0 ? "-----" : dateFormatLong.format(DateUtil.getLastScoreDate(scores))}</p>
          <p><strong>Najveći rezultat: </strong>{highScore}</p>
          <p>
            <strong>Ukupni rezultat: </strong>{totalScore}
          </p>
          <p>
            <strong>Broj igara: </strong>{scores && scores.length}
          </p>
          <p>
            <strong>Prosjek: </strong>{scores && (scores.length === 0 ? "0" : Math.round(totalScore / scores.length * 100) / 100)}
          </p>
        </div>
        {user.scores && (user.scores.length > 0 &&
          <div>
            <strong>Rezultati:</strong>
            <ScoreListBoard scores={user.scores}></ScoreListBoard>
          </div>)}
      </div>
    );
  }
}