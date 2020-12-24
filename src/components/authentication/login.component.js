import React, { Component } from "react";
// components
import Popup from "../popup/popup.component";
// services
import AuthService from "../../services/auth.service";
// styles
import "./auth.css";

export default class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			messages: [],
			showPopup: false
		};

		this.handleLogin = this.handleLogin.bind(this);
		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
		this.loginCallback = this.loginCallback.bind(this);
	}

	onChangeUsername(e) {
		this.setState({ username: e.target.value });
	}

	onChangePassword(e) {
		this.setState({ password: e.target.value });
	}

	togglePopup(messages) {
		let username = "";
		let password = "";
		this.setState({ showPopup: !this.state.showPopup, messages, username, password });
	}

	loginCallback(status, response) {
		let messages = [];
		if (status == 200) {
			localStorage.setItem("user", JSON.stringify(response));
			this.props.history.push("/");
		} else if (status == 401) {
			messages.push("Neispravno korisničko ime ili lozinka.")
		} else {
			messages.push(response.message);
		}
		if (messages.length > 0) {
			this.togglePopup(messages);
		}
	}

	handleLogin() {
		let username = this.state.username;
		let password = this.state.password;
		let messages = [];
		if (!username) {
			messages.push("Korisničko ime je obavezno!");
		}
		if (!password) {
			messages.push("Lozinka je obavezna!");
		}
		if (messages.length == 0) {
			let loginRequest = {}
			loginRequest.username = this.state.username;
			loginRequest.password = this.state.password;
			AuthService.login(loginRequest, this.loginCallback);
		} else {
			this.togglePopup(messages);
		}
	}

	render() {
		let username = this.state.username;
		let password = this.state.password;
		let messages = this.state.messages;
		return (
			<div className="auth">
				<div className="card">
					<div className="card-top">
						<form>
							<div>
								<label>Korisničko ime</label>
								<input type="text" placeholder="Unesite korisničko ime" autoComplete="on" onChange={this.onChangeUsername} value={username}/>
							</div>
							<div>
								<label>Lozinka</label>
								<input type="password" placeholder="Unesite lozinku" autoComplete="on" onChange={this.onChangePassword} value={password} />
							</div>
						</form>
						<button className="button button-login" onClick={this.handleLogin}>Prijava</button>
					</div>
					<div className="card-bottom">
						<div>
							Nemate račun?
						</div>
						<div>
							<button className="button button-register" onClick={() => this.props.history.push("/register")}>Registracija</button>
						</div>
					</div>
				</div>
				{this.state.showPopup && <Popup text={messages} onOk={this.togglePopup} />}
			</div>
		);
	}
}
