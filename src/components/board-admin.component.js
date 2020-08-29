import React, { Component } from "react";
import AuthService from "../services/auth.service";

import "./administration.css";

export default class AdminBoard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      content: "",
      users: []
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    this.setState({ currentUser: currentUser }, () => {
      console.log("User:", this.state.currentUser.username);
    });
  }

  render() {
    return (
      <div className="container-custom">
        <div className="container-button">
          <div className="administration">
            <div>
              <button className="btn btn-primary button-admin" onClick={() => { this.props.history.push("/users") }}>Korisnici</button>
            </div>
            <div>
              <button className="btn btn-primary button-admin" onClick={() => { this.props.history.push("/scores") }}>Rezultati</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
