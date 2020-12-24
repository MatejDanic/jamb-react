import React, { Component } from "react";
// components
import Popup from "../../popup/popup.component";
// services
import AuthService from "../../../services/auth.service";
import FormService from "../../../services/form.service";
// styles
import "../../../constants/colors.css";
import "./button.css";

export default class RestartButton extends Component {

	constructor() {
		super();
		this.state = {
			currentUser: undefined,
			showPopup: false
		}
		this.togglePopup = this.togglePopup.bind(this);
		this.restart = this.restart.bind(this);
	}

	componentDidMount() {
		let currentUser = AuthService.getCurrentUser();
		if (currentUser) this.setState({ currentUser });
	}
	
	togglePopup() {
		this.setState({ showPopup: !this.state.showPopup });
	}

	render() {
		return (
			<div className="form-button bg-lightpink restart" style={{ backgroundImage: 'url(/images/misc/restart.png)' }} onClick={ this.togglePopup } >
				{this.state.showPopup && <Popup text={["Jeste li sigurni da želite početi ispočetka?"]} onClose={ this.togglePopup } onOk={ this.restart } />}
			</div>
		)
	}

	restart() {
		let currentUser = this.state.currentUser;
		if (currentUser) {
			FormService.restartForm(this.props.formId).then(
				() => {
					window.location.reload();
				},
				error => {
					window.location.reload();
					console.log(error.response && error.response.data);
				}
			);
		} else {
			window.location.reload();
		}
	}
}
