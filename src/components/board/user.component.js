import React, { Component } from "react";
// components
import ScoreList from "./score-list.component";
// services
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
// utils
import DateUtil from "../../utils/date.util";
import ScoreUtil from "../../utils/score.util";
// constants
import { dateFormatLong } from "../../constants/date-format";

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentuser: undefined,
      userIsAdmin: false,
      user: "",
      totalScore: 0,
      highScore: 0
    };
  }

  componentDidMount() {
    let currentUser = AuthService.getCurrentUser();
    this.setState({ currentUser });

    let userId = this.props.userId ? this.props.userId : this.props.match.params.userId;
      UserService.getUser(userId).then(
        response => {
          let user = response.data;
          let userIsAdmin = false;
          for (let key in user.roles) {
            if (user.roles[key].label === "ADMIN") userIsAdmin = true;
          }
          let totalScore = ScoreUtil.getTotalScore(user.scores);
          let highScore = ScoreUtil.getHighScore(user.scores);
          this.setState({ user, totalScore, highScore, userIsAdmin });
        },
        error => {
          // console.log(error);
        }
      );
  }

  deleteUser() {
    UserService.deleteUser(this.props.match.params.userId).then(
      response => {
        this.props.history.push("/users");
      },
      error => {
        // console.log(error);
      }
    );
  }

  render() {
    let history = this.props.history;
    let currentUser = this.state.currentuser;
    let userIsAdmin = this.state.userIsAdmin;
    let totalScore = this.state.totalScore;
    let highScore = this.state.highScore;
    let user = this.state.user;
    let scores = user.scores;

    return (
      <div className="container-custom">
          <h3>
            <strong>{user.username}</strong>
          </h3>
          <p>
            <strong>ID: </strong>
            {user.id}
          </p>
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
          {currentUser && currentUser.roles.includes("ADMIN") && !userIsAdmin && <div className="container-button">
            <button className="btn btn-danger button-admin" onClick={() => { if (window.confirm('Jeste li sigurni da izbrisati ovog korisnika?')) this.deleteUser() }}>Izbriši</button>
          </div>}
        {user.scores && (user.scores.length > 0 &&
          <div>
            <ScoreList username={user.username} scores={user.scores} history={history}></ScoreList>
          </div>)}
      </div>
    );
  }
}