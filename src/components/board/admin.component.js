import React, { Component } from "react";

import "./admin.css";

export default class Admin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: "",
      users: []
    };
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
