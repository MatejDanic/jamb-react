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
      currentUser: undefined,
      userIsAdmin: true,
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
          if (user) {
            for (let key in user.roles) {
              if (user.roles[key].label === "ADMIN"){
                userIsAdmin = true;
                break;
              }
            }
          }
          let totalScore = ScoreUtil.getTotalScore(user.scores);
          let highScore = ScoreUtil.getHighScore(user.scores);
          this.setState({ user, totalScore, highScore, userIsAdmin });
        },
        error => {
          console.log(error.response && error.response.data);
        }
      );
  }

  deleteUser() {
    UserService.deleteUser(this.props.match.params.userId).then(
      response => {
        this.props.history.push("/users");
      },
      error => {
        console.log(error.response && error.response.data);
      }
    );
  }

  render() {
    let history = this.props.history;
    let currentUser = this.state.currentUser;
    let user = this.state.user;
    let totalScore = this.state.totalScore;
    let highScore = this.state.highScore;
    let scores = user.scores;
    let userIsAdmin = this.state.userIsAdmin;

    return (
      <div className="container-custom">
          <div className="container-custom-inner">
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
            {currentUser && currentUser.roles.includes("ADMIN") && !userIsAdmin &&
              <button className="delete-button" 
              onClick={() => { if (window.confirm('Jeste li sigurni da želite izbrisati ovog korisnika?')) this.deleteUser() }} />}
          </div>
          <div className="container-custom-second">
            {user.scores && (user.scores.length > 0 &&
              <div>
                <ScoreList username={user.username} scores={user.scores} history={history}></ScoreList>
              </div>)}
            </div>
      </div>
    );
  }
}