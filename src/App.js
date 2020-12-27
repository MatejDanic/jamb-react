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
import UserService from "./services/user.service";
// styles
import "./components/navigation/navigation.css";
import "./constants/colors.css";
import "./App.css";
import { smallWindowThreshold } from "./constants/screen-constants";
import Chat from "./components/chat/chat.component";
import BASE_URL from "./constants/api-url";
import Popup from "./components/popup/popup.component";

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentUser: undefined,
			windowWidth: 0,
			windowHeight: 0,
			smallWindow: false,
			showMenu: window.location.pathname !== "/",
			gameMounted: window.location.pathname === "/",
			showPopup: false,
			messages: [],
			preference: []
		};
		this.updateDimensions = this.updateDimensions.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.logout = this.logout.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
		this.changeVolume = this.changeVolume.bind(this);
		this._form = React.createRef();
	}

	componentDidMount() {
		console.log(BASE_URL)
		let currentUser = AuthService.getCurrentUser();
		if (currentUser) {
			UserService.getUserPreference(currentUser.id)
				.then(response => {
					let preference = response;
					this.setState({ currentUser, preference });
				})
				.catch(response => {
					let messages = [];
					if (response.status && response.error) messages.push(response.status + " " + response.error);
					if (response.message) messages.push(response.message);
					this.togglePopup(messages);
				});
		} else {
			let preference = {}
			preference.volume = 1;
			this.setState({ preference })
		}
		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions);
	}

	togglePopup(messages) {
		this.setState({ showPopup: !this.state.showPopup, messages });
	}

	updateDimensions() {
		let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
		let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
		let smallWindow = windowWidth <= smallWindowThreshold && this.state.smallWindow === false;
		if ((windowWidth > smallWindowThreshold && this.state.smallWindow === true) || (windowWidth <= smallWindowThreshold && this.state.smallWindow === false)) {
			this.setState({ windowWidth, windowHeight, smallWindow });
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

	changeVolume() {
		let preference = {}
		if (this.state.preference.volume < 3) {
			preference.volume = this.state.preference.volume + 1;
		} else {
			preference.volume = 0;
		}
		let currentUser = AuthService.getCurrentUser();
		if (currentUser) {
			UserService.updateUserPreference(currentUser.id, JSON.stringify(preference))
				.then(response => {
					let preference = response;
					if (!preference.volume) preference.volume = 1;
					this.setState({ preference });
				})
				.catch(response => {
					let messages = [];
					if (response.status && response.error) messages.push(response.status + " " + response.error);
					if (response.message) messages.push(response.message);
					this.togglePopup(messages);
				});
		} else {
			this.setState({ preference })
		}
	}

	render() {
		let smallWindow = this.state.smallWindow;
		let showMenu = this.state.showMenu;
		let gameMounted = this.state.gameMounted;
		let messages = this.state.messages;
		let preference = this.state.preference;

		return (
			<Router history={history}>
				<title>Jamb</title>
				{smallWindow ? <Menu onChangeVolume={this.changeVolume} preference={preference} onLogout={this.logout} history={history} showMenu={showMenu} gameMounted={gameMounted} onToggleMenu={this.toggleMenu} /> :
					<Bar onLogout={this.logout} history={history} />}
				<Switch>
					<Route exact path="/" render={() => <Form preference={preference} onLogout={this.logout} ref={this._form} history={history} onGameMounted={(mounted) => this.handleGameMounted(mounted)} smallWindow={smallWindow} onToggleMenu={this.toggleMenu} />} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/admin" component={Admin} />
					<Route exact path="/users" component={UserList} />
					<Route exact path="/users/:userId" component={User} />
					<Route exact path="/profile" component={() => <Profile history={this.props.history} smallWindow={smallWindow} />} />
					<Route exact path="/scores" component={ScoreList} />
					<Route exact path="/scores/:scoreId" component={Score} />
					<Route exact path="/chat" component={Chat} />
					<Route exact path="/chat/:conversationId" component={Chat} />
				</Switch>
				{this.state.showPopup && <Popup text={messages} onOk={this.togglePopup} />}
			</Router>
		);
	}
}

export default App;