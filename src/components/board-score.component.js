import React, { Component } from "react";
import UserService from "../services/user.service";

export default class UserBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    UserService.getUserBoard(this.props.match.params.scoreId).then(
      response => {
        this.setState({
          content: response.data
        }, () => {
          console.log(this.state.content);
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
    let score = this.state.content;
    return (
      <div className="container-custom">
          <h3>
          <strong>Rezultat: </strong>
            <strong>{score.value}</strong>
          </h3>
          <p>
            <strong>ID: </strong>
            {score.id}
          </p>
          <p>
            <strong>Korisnik: </strong>
            {score.user.username}
          </p>
          <p>
            <strong>Datum: </strong>
            {score.date}
          </p>
      </div>
    );
  }
}
