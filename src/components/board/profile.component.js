import React, { Component } from "react";
// history
import history from "../../history/history";
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
    let smallWindow = this.props.smallWindow;
    return (
      <div>
        <div className="profile">{smallWindow && currentUser &&
          <div href="/login" className="btn btn-danger delete-button" style={{ backgroundImage: 'url(/images/misc/logout.png)' }} onClick={this.props.onLogout} />}</div>
        {currentUser && <User userId={currentUser.id} history={history} />}
      </div>
    );
  }
}
