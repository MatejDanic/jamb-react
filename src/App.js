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
import Popup from "./components/popup/popup.component";
import Chat from "./components/chat/chat.component";
import SockJsClient from "react-stomp";
// services
import AuthService from "./services/auth.service";
import UserService from "./services/user.service";
// styles
import "./components/navigation/navigation.css";
import "./constants/colors.css";
import "./App.css";
// constants
import { hourFormat } from "./constants/date-format";
import { smallWindowThreshold } from "./constants/screen-constants";
import BASE_URL from "./constants/api-url";

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
			preference: [],
			socketMessages: [],
		};
		this.updateDimensions = this.updateDimensions.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.logout = this.logout.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
		this.changeVolume = this.changeVolume.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.getTopics = this.getTopics.bind(this);
		this.login = this.login.bind(this);
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
		if (this.socket) {
			this.socket.sendMessage("/app/goodbye", JSON.stringify({
				username: (this.state.currentUser ? this.state.currentUser.username : "Gost")
			}));
		}
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

	sendMessage(channel, content) {
		let currentUser = AuthService.getCurrentUser();
		if (content) {
			let message = {};
			message.content = content;
			message.username = currentUser ? currentUser.username : "Gost";
			if (this.socket) {
				this.socket.sendMessage("/app" + channel, JSON.stringify(message));
			}
		}
	};

	getTopics() {
		let topics = [];
		topics.push("/topic/everyone");
		let currentUser = AuthService.getCurrentUser();
		if (currentUser && currentUser.roles && currentUser.roles.includes("ADMIN")) {
			topics.push("/topic/greetings");
		}
		return topics;
	}

	login(user) {
		localStorage.setItem("user", user);
		console.log("Logging in...");
		history.push("/");
		setTimeout(() => {this.sendMessage("/hello", "Bok");}, 1000);
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
					<Route exact path="/login" component={() => <Login onLogin={this.login} />} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/admin" component={Admin} />
					<Route exact path="/users" component={UserList} />
					<Route exact path="/users/:userId" component={User} />
					<Route exact path="/profile" component={() => <Profile history={this.props.history} smallWindow={smallWindow} />} />
					<Route exact path="/scores" component={ScoreList} />
					<Route exact path="/scores/:scoreId" component={Score} />
					<Route exact path="/chat" component={() => <Chat messages={this.state.socketMessages} onSendMessage={(channel, message) => this.sendMessage(channel, message)}/>} />
					<Route exact path="/chat/:conversationId" component={Chat} />
				</Switch>
				{this.state.showPopup && <Popup text={messages} onOk={this.togglePopup} />}
				<SockJsClient url={BASE_URL + "/socket"}
					topics={this.getTopics()}
					onMessage={response => {
						let message = response;
						message.time = hourFormat.format(Date.now());
						let socketMessages = this.state.socketMessages;
						socketMessages.push(message);	
						socketMessages = socketMessages.slice(Math.max(socketMessages.length - 100, 0)); 
						this.setState({ socketMessages });
					}}
					onConnect={() => {
						this.sendMessage("/hello", "Bok");
						console.log("Connected")
					}}
					onDisconnect={() => {
						console.log("Disconnected")
					}}
					ref={(client) => {
						this.socket = client;
					}} />
			</Router>
		);
	}
}

export default App;