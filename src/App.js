import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./components/navigation/navigation.css";
import history from "./history";

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
import Menu from "./components/navigation/menu.component";
import Bar from "./components/navigation/bar.component";

import "./constants/colors.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      windowWidth: 0,
      windowHeight: 0,
      currentUser: undefined,
      smallWindow: false,
      showMenu: window.location.pathname !== "/",
      gameMounted: window.location.pathname === "/"
    };
    this.logout = this.logout.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  updateDimensions() {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    if ((windowWidth > 512 && this.state.smallWindow === true) || (windowWidth <= 512 && this.state.smallWindow === false)) {
      this.setState({ windowWidth, windowHeight }, () => {
        let smallWindow = windowWidth <= 512 && this.state.smallWindow === false;
        this.setState({ smallWindow });
      });
    }
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user
      });
    }
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  logout() {
    AuthService.logout();
    history.push("/login");
    window.location.reload();
  }

  handleGameMounted(mounted) {
    if (!this.state.gameMounted && mounted && window.location.pathname === "/") {
      this.setState({ gameMounted: mounted });
    } else if (this.state.gameMounted && !mounted && window.location.pathname !== "/") {
      this.setState({ gameMounted: mounted });
    }
  }

  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu });
}

  render() {
    let currentUser = this.state.currentUser
    let smallWindow = this.state.smallWindow;
    let showMenu = this.state.showMenu;
    let gameMounted = this.state.gameMounted;
    return (
        <Router history={history}>
          <title>Jamb</title>
          {smallWindow ? <Menu currentUser={currentUser} showMenu={showMenu} history={history} gameMounted={gameMounted} onToggleMenu={this.toggleMenu}/> :
           <Bar currentUser={currentUser} onLogout={this.logout} history={history} />}
          <Switch>
            <Route exact path="/" render={() => <Game onGameMounted={(mounted) => this.handleGameMounted(mounted)} smallWindow={smallWindow} onToggleMenu={this.toggleMenu} />} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/users" component={UserList} />
            <Route exact path="/users/:userId" component={User}/>
            <Route exact path="/profile" component={() => <Profile smallWindow={smallWindow} onLogout={this.logout} />}  />
            <Route exact path="/scores" component={ScoreList} />
            <Route exact path="/scores/:scoreId" component={Score} />
          </Switch>
        </Router>
    );
  }
}

export default App;