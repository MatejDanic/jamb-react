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
import Bar from "./components/navigation/bar.component";
import Burger from "./components/navigation/burger.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      windowWidth: 0,
      windowHeight: 0,
      currentUser: undefined,
      showBurgerButton: false,
      showBurgerMenu: false
    };
    this.logout = this.logout.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    if ((windowWidth > 512 && this.state.showBurgerButton === true) || (windowWidth <= 512 && this.state.showBurgerButton === false)) {
      this.setState({ windowWidth, windowHeight }, () => {
        let showBurgerButton = windowWidth <= 512 && this.state.showBurgerButton === false;        
        this.setState({ showBurgerButton });
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
    // console.log("logout");
    AuthService.logout();
  }

  toggleBurgerMenu() {
    this.setState({ showBurgerMenu: !this.state.showBurgerMenu }, () => {
      // console.log(this.state.showBurgerMenu);
    })
  }

  render() {
    const { currentUser } = this.state;
    const links = {
      jamb: <Link to={"/"} className="nav-link">Jamb</Link>,
      admin: <Link to={"/admin"} className="nav-link">Administracija</Link>,
      profile: <Link to={"/profile"} className="nav-link">{currentUser && currentUser.username}</Link>,
      login: <Link to={"/login"} className="nav-link">Prijava</Link>,
      register: <Link to={"/register"} className="nav-link">Registracija</Link>,
      logout: <a href="/login" className="nav-link" onClick={() => this.logout}>Odjava</a>
    }
    let showBurgerButton = this.state.showBurgerButton;
    let showBurgerMenu = this.state.showBurgerMenu;
    return (
      <Router>
        <title>Jamb</title>
        {!showBurgerButton ? <Bar links={links} /> : (showBurgerMenu && <Burger links={links} onToggleBurgerMenu={() => this.toggleBurgerMenu()}/>)}
        <Switch>
          <Route exact path="/" component={() => <Game showBurgerButton={showBurgerButton} onToggleBurgerMenu={() => this.toggleBurgerMenu()}/>} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/users" component={UserList} />
          <Route exact path="/users/:userId" component={User} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/scores" component={ScoreList} />
          <Route exact path="/scores/:scoreId" component={Score} />
        </Switch>
      </Router>
    );
  }
}

export default App;
