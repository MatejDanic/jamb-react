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
import PopupConfirm from "./components/popup/popup-confirm.component";
import Chat from "./components/chat/chat.component";
import SockJsClient from "react-stomp";
import FormChallenge from "./components/game/form/form-challenge.component";
// services
import AuthService from "./services/auth.service";
import UserService from "./services/user.service";
import FormService from "./services/form.service";
// styles
import "./components/navigation/navigation.css";
import "./constants/colors.css";
import "./App.css";
// constants
import { hourFormat } from "./constants/date-format";
import { smallWindowThreshold } from "./constants/screen-constants";
import API_URL from "./constants/api-url";

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
			showPopupConfirm: false,
			messages: [],
			preference: [],
			socketMessages: [],
			challengeStatus: { inGame: false },
			challengeData: {},
		};
		this.updateDimensions = this.updateDimensions.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.logout = this.logout.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
		this.togglePopupConfirm = this.togglePopupConfirm.bind(this);
		this.changeVolume = this.changeVolume.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.getTopics = this.getTopics.bind(this);
		this.login = this.login.bind(this);
		this.handleSocketMessage = this.handleSocketMessage.bind(this);
		this.challenge = this.challenge.bind(this);
		this.challengeAccept = this.challengeAccept.bind(this);
		this.challengeDeny = this.challengeDeny.bind(this);
		this.challengeQuit = this.challengeQuit.bind(this);
		this.resetChallengeStatus = this.resetChallengeStatus.bind(this);
		this.endTurn = this.endTurn.bind(this);
		this.child = React.createRef();
	}

	componentDidMount() {
		console.log(API_URL);
		let currentUser = AuthService.getCurrentUser();
		if (currentUser) {
			UserService.getUserPreference(currentUser.id)
				.then(response => {
					let preference = response;
					if ((preference.volume == null || preference.volume == undefined) && preference.volume != 0) preference.volume = 1;
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
		this.sendMessage("/greeting", "Goodbye", null, "Greeting");
	}

	logout() {
		AuthService.logout();
		history.push("/login");
		window.location.reload();
	}

	handleGameMounted(mounted) {
		if (!this.state.gameMounted && mounted && (window.location.pathname === "/" || window.location.pathname === "/challenge")) {
			this.setState({ gameMounted: mounted });
		} else if (this.state.gameMounted && !mounted && (window.location.pathname !== "/" || window.location.pathname === "/challenge")) {
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
					if ((preference.volume == null || preference.volume == undefined) && preference.volume != 0) preference.volume = 1;
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

	sendMessage(channel, message, content, reciever) {
		if (message) {
			let currentUser = AuthService.getCurrentUser();
			let messageRequest = {};
			messageRequest.message = message;
			messageRequest.sender = currentUser ? currentUser.username : "Gost";
			if (content || content == 0) messageRequest.content = JSON.stringify(content);
			if (currentUser) messageRequest.token = currentUser.accessToken;
			if (reciever) messageRequest.reciever = reciever;
			if (this.socket) {
				try {
					this.socket.sendMessage("/app" + channel, JSON.stringify(messageRequest));
				} catch (error) {
					console.log(error);
				}
			}
		}
	};

	getTopics() {
		let topics = [];
		topics.push("/topic/everyone");
		let currentUser = AuthService.getCurrentUser();
		if (currentUser) {
			if (currentUser.roles && currentUser.roles.includes("ADMIN")) topics.push("/topic/greetings");
			if (currentUser.username) topics.push("/user/topic/challenge");
		}
		return topics;
	}

	login(user) {
		localStorage.setItem("user", user);
		history.push("/");
		setTimeout(() => { this.sendMessage("/greeting", "Hello", null, null); }, 1000);
	}

	handleSocketMessage(message) {
		message.time = hourFormat.format(Date.now());
		let socketMessages = this.state.socketMessages;
		if (message.type == "CHALLENGE") {
			this.handleChallenge(message);
		} else {
			socketMessages.push(message);
			socketMessages = socketMessages.slice(Math.max(socketMessages.length - 100, 0));
			this.setState({ socketMessages });
		}
	}

	resetChallengeStatus() {
		let challengeStatus = this.state.challengeStatus;
		challengeStatus.inGame = false;
		challengeStatus.waiting = false;
		challengeStatus.challenged = false;
		this.setState({ challengeStatus });
	}

	handleChallenge(message) {
		let challengeStatus = this.state.challengeStatus;
		let challengeData = this.state.challengeData;
		if (challengeStatus.inGame) {
			if (message.message == "Form") {
				let challengeData = this.state.challengeData;
				challengeData.form = JSON.parse(message.content);
				this.child.current.setForm(challengeData.form);
			} else if (message.message == "Dice") {
				let challengeData = this.state.challengeData;
				challengeData.form = JSON.parse(message.content);
				this.child.current.updateDice(challengeData.form, challengeData.form.dice);
			} else if (message.message == "Announcement") {
				let challengeData = this.state.challengeData;
				challengeData.form = JSON.parse(message.content);
				this.child.current.setAnnouncement(challengeData.form.announcement);
			} else if (message.message == "Box") {
				let challengeData = this.state.challengeData;
				challengeData.form = JSON.parse(message.content);
				this.child.current.setForm(challengeData.form);
			} else if (message.message == "Turn") {
				let currentUser = this.state.currentUser;
				UserService.getUserForm(currentUser.id)
					.then(response => {
						let form = response;
						let challengeData = this.state.challengeData;
						this.sendMessage("/challenge", "Form", form, challengeData.opponent);
						this.child.current.setForm(form);
					})
					.catch(response => {
						let messages = [];
						if (response.status && response.error) messages.push(response.status + " " + response.error);
						if (response.message) messages.push(response.message);
						this.togglePopup(messages);
						setTimeout(() => { history.push("/") }, 3000);
					});
				this.endTurn();
			} else if (message.message == "Score") {
				let challengeData = this.state.challengeData;
				challengeData.opponentScore = message.content;
				this.setState({ challengeData }, () => {
					if (challengeData.myScore != null && challengeData.opponentScore != null && challengeData.myScore != undefined && challengeData.opponentScore != undefined) {
						let winner = challengeData.myScore > challengeData.opponentScore ? challengeData.me : challengeData.opponent;
						this.sendMessage("/challenge", "End", winner, challengeData.opponent);
						this.togglePopup([challengeData.me + ": " + challengeData.myScore, challengeData.opponent + ": " + challengeData.opponentScore, "Pobjednik je " + winner + "!"]);
					}
				});
			} else if (message.message == "End") {
				let winner = challengeData.myScore > challengeData.opponentScore ? challengeData.me : challengeData.opponent;
				this.togglePopup([challengeData.me + ": " + challengeData.myScore, challengeData.opponent + ": " + challengeData.opponentScore, "Pobjednik je " + winner + "!"]);
			} else if (message.message == "Quit") {
				this.togglePopup([challengeData.opponent + " odustaje od izazova!"]);
				this.challengeQuit();
			} else {
				this.challengeDeny();
			}
		} else {
			if (challengeStatus.waiting) {
				if (message.message.includes("Accept")) {
					this.togglePopup([challengeStatus.reciever + " prihvaća izazov!"])
					challengeStatus.waiting = false;
					challengeStatus.inGame = true;
					FormService.newForm()
						.then(response => {
							let form = response;
							this.sendMessage("/challenge", "Accept", form, challengeStatus.challenger);
							let challengeData = this.initializeChallengeData(challengeStatus.reciever, JSON.parse(message.content), challengeStatus.reciever);
							this.setState({ challengeStatus, challengeData });
							history.push("/challenge");
						})
						.catch(response => {
							let messages = [];
							if (response.status && response.error) messages.push(response.status + " " + response.error);
							if (response.message) messages.push(response.message);
							this.togglePopup(messages);
							setTimeout(() => { history.push("/") }, 3000);
						});
				} else if (message.message.includes("Deny")) {
					challengeStatus.waiting = false;
					this.togglePopup([challengeStatus.reciever + " odbija izazov!"])
				}
			}
			if (message.message.includes("Request")) {
				if (this.state.challengeStatus.inGame) {
					setTimeout(() => { history.push("/") }, 2000);

				} else {
					this.togglePopupConfirm([message.username + " te pokušava izazvati, želiš li prihvatiti?"])
					challengeStatus.challenged = true;
					challengeStatus.challenger = message.username;
				}
			}
		}
		this.setState({ challengeStatus });
	}

	challenge(reciever) {
		let currentUser = AuthService.getCurrentUser();
		if (currentUser) {
			this.sendMessage("/challenge", "Request", null, reciever);
			this.togglePopup(["Korisniku " + reciever + " poslan izazov..."]);
			let challengeStatus = this.state.challengeStatus;
			challengeStatus.waiting = true;
			challengeStatus.reciever = reciever;
			this.setState({ challengeStatus });
		}
	}

	togglePopupConfirm(messages) {
		this.setState({ showPopupConfirm: !this.state.showPopupConfirm, messages });
	}

	challengeAccept() {
		let currentUser = this.state.currentUser;
		if (currentUser) {
			let challengeStatus = this.state.challengeStatus;
			if (challengeStatus.challenged) {
				challengeStatus.waiting = false;
				challengeStatus.inGame = true;
				FormService.newForm()
					.then(response => {
						let form = response;
						this.sendMessage("/challenge", "Accept", form, challengeStatus.challenger);
						let challengeData = this.initializeChallengeData(challengeStatus.challenger, form, currentUser.username);
						this.setState({ challengeStatus, challengeData });
						history.push("/challenge");
					})
					.catch(response => {
						let messages = [];
						if (response.status && response.error) messages.push(response.status + " " + response.error);
						if (response.message) messages.push(response.message);
						this.togglePopup(messages);
						setTimeout(() => { history.push("/") }, 3000);
					});
			}
		}
		this.togglePopupConfirm();
	}

	initializeChallengeData(opponent, form, turn) {
		let currentUser = this.state.currentUser;
		let challengeData = this.state.challengeData;
		challengeData.form = form;
		challengeData.me = currentUser.username;
		challengeData.opponent = opponent;
		challengeData.turn = turn;
		return challengeData;
	}

	challengeDeny() {
		let currentUser = this.state.currentUser;
		if (currentUser) {
			let challengeStatus = this.state.challengeStatus;
			if (challengeStatus.challenged) {
				this.sendMessage("/challenge", "Deny", null, challengeStatus.challenger);
				challengeStatus.challenged = false;
				this.setState({ challengeStatus });
			}
		}
	}

	challengeQuit() {
		let currentUser = this.state.currentUser;
		if (currentUser) {
			let challengeData = this.state.challengeData;
			this.sendMessage("/challenge", "Quit", null, challengeData.opponent);
			this.resetChallengeStatus();
			setTimeout(() => { history.push("/"); }, 1000);
		}
	}

	endTurn() {
		let currentUser = this.state.currentUser;
		if (currentUser) {
			let challengeData = this.state.challengeData;
			if (challengeData.turn == challengeData.opponent) {
				challengeData.turn = challengeData.me;
			} else {
				challengeData.turn = challengeData.opponent;
			}
			this.setState({ challengeData });
		}
	}

	handleEndGame(score) {
		let challengeData = this.state.challengeData;
		challengeData.myScore = score;
		this.setState({ challengeData });
	}

	render() {
		let smallWindow = this.state.smallWindow;
		let showMenu = this.state.showMenu;
		let gameMounted = this.state.gameMounted;
		let messages = this.state.messages;
		let preference = this.state.preference;
		let challengeStatus = this.state.challengeStatus;
		let challengeData = this.state.challengeData;

		return (
			<Router history={history}>
				<title>Jamb</title>
				{smallWindow ? <Menu onChangeVolume={this.changeVolume} preference={preference} onLogout={this.logout} history={history} showMenu={showMenu} gameMounted={gameMounted} onToggleMenu={this.toggleMenu} /> :
					<Bar onLogout={this.logout} history={history} />}
				<Switch>
					<Route exact path="/" render={() => <Form preference={preference} onLogout={this.logout} history={history} onGameMounted={(mounted) => this.handleGameMounted(mounted)} smallWindow={smallWindow} onToggleMenu={this.toggleMenu} />} />
					<Route exact path="/login" component={() => <Login onLogin={this.login} history={history} />} />
					<Route exact path="/register" component={() => <Register history={history} />} />
					<Route exact path="/admin" component={Admin} />
					<Route exact path="/users" component={UserList} />
					<Route exact path="/users/:userId" component={(props) => <User {...props} onChallenge={(reciever) => this.challenge(reciever)} />} />
					<Route exact path="/profile" component={() => <Profile history={this.props.history} smallWindow={smallWindow} />} />
					<Route exact path="/scores" component={ScoreList} />
					<Route exact path="/scores/:scoreId" component={Score} />
					<Route exact path="/chat" component={() => <Chat messages={this.state.socketMessages} onSendMessage={(message) => this.sendMessage("/text", message, null, null)} />} />
					<Route exact path="/chat/:conversationId" component={Chat} />
					<Route exact path="/challenge" render={() => <FormChallenge ref={this.child} onQuit={this.challengeQuit} onEndGame={(finalScore) => this.handleEndGame(finalScore)} onEndTurn={this.endTurn} onSendMessage={(message, content) => this.sendMessage("/challenge", message, content, challengeData.opponent)} challengeData={challengeData} challengeStatus={challengeStatus} onResetChallengeStatus={this.resetChallengeStatus} preference={preference} history={history} onGameMounted={(mounted) => this.handleGameMounted(mounted)} smallWindow={smallWindow} />} />
				</Switch>
				{this.state.showPopup && <Popup text={messages} onOk={this.togglePopup} />}
				{this.state.showPopupConfirm && <PopupConfirm text={messages} onOk={this.challengeAccept} onClose={this.challengeDeny} />}
				<SockJsClient url={API_URL + "/socket"}
					topics={this.getTopics()}
					onMessage={response => {
						this.handleSocketMessage(response);
					}}
					onConnect={() => {
						this.sendMessage("/greeting", "Hello", null, "Greeting");
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