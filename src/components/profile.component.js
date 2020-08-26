import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserBoard from "./board-user.component";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }

  render() {
    return (
      <div></div>
    );
  }
}
