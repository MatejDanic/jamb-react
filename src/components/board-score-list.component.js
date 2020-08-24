

import React, { Component } from "react";
import AuthService from "../services/auth.service";
import "./administration.css";

export default class ScoreListBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiURL: "http://localhost:8080",
      // apiURL: "https://jamb-spring.herokuapp.com",
      currentUser: undefined,
      content: ""
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    this.setState({ currentUser: currentUser });
  }

  render() {
    return (
      <div>
        <div>
          AAa
      </div>
        <div>
          AAa
      </div>
        <div>
          AAa
      </div>
        <div>
          AAa
      </div>
      </div>
    );
  }
}