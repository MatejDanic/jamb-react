import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import AdminBoard from "./components/board-admin.component";
import Game from "./components/jamb/game.component";
import UserListBoard from "./components/board-user-list.component";
import UserBoard from "./components/board-user.component";
import ScoreListBoard from "./components/board-score-list.component";
import ScoreBoard from "./components/board-score.component";


class App extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);

    this.state = {
      showAdminBoard: false,
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ADMIN")
      });
    }
  }

  logout() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showAdminBoard } = this.state;
    return (
      <Router>
        <div>
          <title>Jamb</title>
          <nav className="navbar navbar-expand navbar-dark bg-dark" style={{ height: '5vh' }}>

            <div className="navbar-nav mr-auto">
              <Link to={"/"} className="nav-link">
                Jamb
        </Link>
              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Administracija
        </Link>
                </li>
              )}

            </div>

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                </li>
                <li className="nav-item">
                  <Link to={"/users/" + currentUser.id} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logout}>
                    Odjava
                 </a>
                </li>
              </div>
            ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      Prijava
            </Link>
                  </li>

                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link">
                      Registracija
            </Link>
                  </li>
                </div>
              )}
          </nav>
          <div>
            <Switch>
              <Route exact path="/" component={Game} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/admin" component={AdminBoard} />
              <Route exact path="/users" component={UserListBoard} />
              <Route exact path="/users/:userId" component={UserBoard} />
              <Route exact path="/scores" component={ScoreListBoard} />
              <Route exact path="/scores/:scoreId" component={ScoreBoard} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
