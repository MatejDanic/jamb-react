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
    UserService.getUser(this.props.match.params.userId).then(
      response => {
        this.setState({ content: response.data });
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
    let user = this.state.content;
    return (
      <div className="container-custom">
          <h3>
          <strong>Korisničko ime: </strong>
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
          <strong>Rezultati</strong>
          <ul>
            {user.scores &&
              user.scores.map((score, id) => <li key={id}>{score.value}</li>)}
          </ul>
      </div>
    );
  }
}
