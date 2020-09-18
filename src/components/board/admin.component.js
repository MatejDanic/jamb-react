import React, { Component } from "react";
import AuthService from "../../services/auth.service";

import "./admin.css";

export default class Admin extends Component {

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
    this.setState({ currentUser: currentUser });
  }

  render() {
    return (
      <div className="container-custom">
        <div className="container-button">
          <div className="admin">
            <div>
              <button className="btn btn-primary button-admin bg-light-sky-blue" onClick={() => { this.props.history.push("/users") }}>Korisnici</button>
            </div>
            <div>
              <button className="btn btn-primary button-admin bg-light-sky-blue" onClick={() => { this.props.history.push("/scores") }}>Rezultati</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
