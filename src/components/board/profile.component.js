import React, { Component } from "react";
// components
import User from "./user.component";
// services
import AuthService from "../../services/auth.service";

export default class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    let currentUser = AuthService.getCurrentUser();
    if (currentUser) this.setState({ currentUser });
  }

  render() {
    let currentUser = this.state.currentUser;
    return (
      <div>
        {currentUser && <User userId={currentUser.id} history={this.props.history} />}
      </div>
    );
  }
}
