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
			let credentials = {}
			credentials.username = this.state.username;
            credentials.password = this.state.password;
            AuthService.register(JSON.stringify(credentials))
                .then(response => {
                    let messages = [];
                    messages.push(response.message);
                    this.togglePopup(messages);
                    setTimeout(() => {this.props.history.push("/login")}, 1000);
                })
                .catch(response => {
                    let messages = [];
                    if (response.status && response.error) messages.push(response.status + " " + response.error);
                    if (response.message) messages.push(response.message);
                    if (response.errors) {
                        for (let i in response.errors) {
                            messages.push(response.errors[i].defaultMessage);
                        }
                    }
                    this.togglePopup(messages);
                });
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
								<input type="text" placeholder="Unesite korisničko ime" autoComplete="on" onChange={this.onChangeUsername} value={username} />
							</div>
							<div>
								<label>Lozinka</label>
								<input type="password" placeholder="Unesite lozinku" autoComplete="on" onChange={this.onChangePassword} value={password}/>
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
