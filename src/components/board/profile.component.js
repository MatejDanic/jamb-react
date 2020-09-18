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
    let currentUser = this.state.currentUser;
    let smallWindow = this.props.smallWindow;
    return (
      <div>
        <div className="profile">{smallWindow && currentUser &&
          <div href="/login" className="btn btn-danger delete-button" style={{ backgroundImage: 'url(/images/misc/logout.png)' }} onClick={this.props.onLogout} />}</div>
        {currentUser && <User userId={this.state.currentUser.id} history={this.props.history} />}
      </div>
    );
  }
}
