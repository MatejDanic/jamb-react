import React, { Component } from "react";
// history
import history from "../../history/history";
// components
import User from "./user.component";
// services
import AuthService from "../../services/auth.service";

export default class Profile extends Component {
  render() {
    let currentUser = AuthService.getCurrentUser();
    let smallWindow = this.props.smallWindow;
    return (
      <div>
        <div className="profile">{smallWindow && currentUser &&
          <div href="/login" className="btn btn-danger delete-button" style={{ backgroundImage: 'url(/images/misc/logout.png)' }} onClick={this.props.onLogout} />}</div>
        {currentUser && <User userId={this.state.currentUser.id} history={history} />}
      </div>
    );
  }
}
