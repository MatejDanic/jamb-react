

import React, { Component } from "react";
import AuthService from "../services/auth.service";
import ScoreService from "../services/score.service";
import "./administration.css";

export default class ScoreListBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      content: ""
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    this.setState({ currentUser: currentUser }, () => {
      console.log("User:", this.state.currentUser.username);
    });
    ScoreService.getScores().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
      let scores = this.state.scores;
    return (
      <div className="container-custom">
        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Vrijednost</th>
              <th>Korisnik</th>
              <th>Datum</th>
              <th></th>
            </tr>
            {scores && scores.map(score => <tr key={score.id}>
              <td>{score.id}</td>
              <td>{score.value}</td>
              <td>{score.user.username}</td>
              <td>{score.date}</td>
              <td>
                <button className="btn btn-info button" onClick={() => {this.props.history.push("/scores/" + score.id)}}>Detalji</button>
                <button className="btn btn-edit button" onClick={() => {}}>Uredi</button>
                <button className="btn btn-danger button" onClick={() => {}}>Izbriši</button>
              </td>
              </tr>)}
          </tbody>
        </table>
        
      </div>
    );
  }
}