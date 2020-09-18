import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import User from "./user.component";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }

  render() {
    return (
      <div>
        <User userId={this.state.currentUser.id} history={this.props.history}></User>
      </div>
    );
  }
}
