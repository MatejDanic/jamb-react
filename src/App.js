import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/authentication/login.component";
import Register from "./components/authentication/register.component";
import Admin from "./components/board/admin.component";
import Game from "./components/jamb/game/game.component";
import Profile from "./components/board/profile.component";
import UserList from "./components/board/user-list.component";
import User from "./components/board/user.component";
import ScoreList from "./components/board/score-list.component";
import Score from "./components/board/score.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);

    this.state = {
      showAdmin: false,
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showAdmin: user.roles.includes("ADMIN")
      });
    }
  }

  logout() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showAdmin } = this.state;
    return (
      <Router>
        <div>
          <title>Jamb</title>
          <nav className="navbar navbar-expand navbar-dark bg-dark" style={{ height: '5vh' }}>

            <div className="navbar-nav mr-auto">
              <Link to={"/"} className="nav-link">
                Jamb
        </Link>
              {showAdmin && (
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
                  <Link to={"/profile"} className="nav-link">
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
              <Route exact path="/admin" component={Admin} />
              <Route exact path="/users" component={UserList} />
              <Route exact path="/users/:userId" component={User} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/scores" component={ScoreList} />
              <Route exact path="/scores/:scoreId" component={Score} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
