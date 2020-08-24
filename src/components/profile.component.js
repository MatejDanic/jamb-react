import React, { Component } from "react";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
          <strong>Korisničko ime: </strong>
            <strong>{currentUser.username}</strong>
          </h3>
          <p>
            <strong>ID:</strong>{" "}
            {currentUser.id}
          </p>
          <strong>Uloge:</strong>
          <ul>
            {currentUser.roles &&
              currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
          </ul>
        </header>
      </div>
    );
  }
}
