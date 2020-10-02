import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
// history
import history from "./history/history";
// components
import Login from "./components/authentication/login.component";
import Register from "./components/authentication/register.component";
import Admin from "./components/board/admin.component";
import Form from "./components/game/form/form.component";
import Profile from "./components/board/profile.component";
import UserList from "./components/board/user-list.component";
import User from "./components/board/user.component";
import ScoreList from "./components/board/score-list.component";
import Score from "./components/board/score.component";
import Menu from "./components/navigation/menu.component";
import Bar from "./components/navigation/bar.component";
// services
import AuthService from "./services/auth.service";
// stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/navigation/navigation.css";
import "./constants/colors.css";
import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: undefined,
      windowWidth: 0,
      windowHeight: 0,
      smallWindow: false,
      showMenu: window.location.pathname !== "/",
      gameMounted: window.location.pathname === "/"
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.logout = this.logout.bind(this);

    this._form = React.createRef();
  }

  componentDidMount() {
    let currentUser = AuthService.getCurrentUser();
    if (currentUser) this.setState({ currentUser });
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    window.addEventListener("keypress", (e) => this.handleKeyPress(e, this._form.current));
  }

  updateDimensions() {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    let smallWindow = windowWidth <= 512 && this.state.smallWindow === false;
    if ((windowWidth > 512 && this.state.smallWindow === true) || (windowWidth <= 512 && this.state.smallWindow === false)) {
      this.setState({ windowWidth, windowHeight, smallWindow });
    }
  }

  handleKeyPress(e, formComponent) {
    if (e.code === "Space" && !this.state.currentUser) {
      let form = formComponent.state.form;
      for (let i in form.columns) {
        let column = form.columns[i];
        if (column.columnType.label !== "ANNOUNCEMENT") {
          for (let j in column.boxes) {
            let box = column.boxes[j];
            formComponent.handleRollDice();
            formComponent.fillBox(column.columnType, box.boxType);
          }
        }
      }
    }
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
    let smallWindow = this.state.smallWindow;
    let showMenu = this.state.showMenu;
    let gameMounted = this.state.gameMounted;
    return (
        <Router history={history}>
          <title>Jamb</title>
          {smallWindow ? <Menu onLogout={this.logout} history={history} showMenu={showMenu} gameMounted={gameMounted} onToggleMenu={this.toggleMenu} /> :
            <Bar onLogout={this.logout} history={history} />}
          <Switch>
            <Route exact path="/" render={() => <Form ref={this._form} history={history} onGameMounted={(mounted) => this.handleGameMounted(mounted)} smallWindow={smallWindow} onToggleMenu={this.toggleMenu} />} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/users" component={UserList} />
            <Route exact path="/users/:userId" component={User} />
            <Route exact path="/profile" component={() => <Profile  history={this.props.history} smallWindow={smallWindow} />} />
            <Route exact path="/scores" component={ScoreList} />
            <Route exact path="/scores/:scoreId" component={Score} />
          </Switch>
        </Router>
    );
  }
}

export default App;