import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import UserListBoard from "./board-user-list.component.js";
import ScoreListBoard from "./board-score-list.component.js";

import "./administration.css";

export default class AdminBoard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      apiURL: "http://localhost:8080",
      // apiURL: "https://jamb-spring.herokuapp.com",
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
    UserService.getAdminBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    const history = useHistory();
    return (
      <div className="administration">
        <Router>
          <li>
            <Link to={"/admin/users"}>
              Korisnici
        </Link>
          </li>
          <li>
          <Link to={"/admin/scores"}>
              Rezultati
        </Link>
          </li>
          <Switch>
            <Route exact path="/admin/users" component={UserListBoard} />
            <Route exact path="/admin/scores" component={ScoreListBoard} />
          </Switch>
        </Router>
      </div>
    );
  }
}
