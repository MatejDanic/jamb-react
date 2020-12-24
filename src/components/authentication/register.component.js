import React, { Component } from "react";
// services
import AuthService from "../../services/auth.service";
import Popup from "../popup/popup.component";
// styles
import "./auth.css";

export default class Register extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			successful: false,
			messages: []
		};

		this.handleRegister = this.handleRegister.bind(this);
		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
		this.registerCallback = this.registerCallback.bind(this);
		this.redirectToLogin = this.redirectToLogin.bind(this);
	}

	onChangeUsername(e) {
		this.setState({
			username: e.target.value
		});
	}

	onChangePassword(e) {
		this.setState({
			password: e.target.value
		});
	}

	togglePopup(messages) {
		let username = "";
		let password = "";
		this.setState({ showPopup: !this.state.showPopup, messages, username, password });
	}

	redirectToLogin() {
		this.props.history.push("/login")
	}

	registerCallback(status, response) {
		console.log(response);
		let messages = [];
		if (status == 200) {
			messages.push("Korisnik " + this.state.username + " uspješno registriran.");
			setTimeout(this.redirectToLogin, 1000);
		} else {
			if (response.errors) {
				for (let i in response.errors) {
					messages.push(response.errors[i].defaultMessage);
				}
			} else if (response.message) {
				messages.push(response.message);
			}
		}
		this.togglePopup(messages);
	}

	handleRegister() {
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
			let registerRequest = {}
			registerRequest.username = this.state.username;
			registerRequest.password = this.state.password;
			AuthService.register(registerRequest, this.registerCallback);
		} else {
			this.togglePopup(messages);
		}
	}

	render() {
		let messages = this.state.messages;
		return (
			<div className="auth">
				<div className="card">
					<div className="card-top">
						<form>
							<div>
								<label>Korisničko ime</label>
								<input type="text" placeholder="Unesite korisničko ime" autoComplete="on" onChange={this.onChangeUsername} />
							</div>
							<div>
								<label>Lozinka</label>
								<input type="password" placeholder="Unesite lozinku" autoComplete="on" onChange={this.onChangePassword} />
							</div>
						</form>
						<button className="button button-register" onClick={this.handleRegister}>Registracija</button>
					</div>
					<div className="card-bottom">
						<div>
							Imate račun?
						</div>
						<div>
							<button className="button button-login" onClick={() => this.props.history.push("/login")}>Prijava</button>
						</div>
					</div>
					{this.state.showPopup && <Popup text={messages} onOk={this.togglePopup} />}
				</div>
			</div>
		);
	}
}
