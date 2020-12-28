import React, { Component } from "react";
// components
import PopupConfirm from "../../popup/popup-confirm.component";
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
            showPopupConfirm: false
        }
        this.togglePopupConfirm = this.togglePopupConfirm.bind(this);
        this.restart = this.restart.bind(this);
    }

    componentDidMount() {
        let currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser });
    }

    togglePopupConfirm() {
        this.setState({ showPopupConfirm: !this.state.showPopupConfirm });
    }

    render() {
        return (
            <div className="form-button bg-lightpink restart" style={{ backgroundImage: 'url(/images/misc/restart.png)' }} onClick={this.togglePopupConfirm} >
                {this.state.showPopupConfirm && <PopupConfirm text={["Jeste li sigurni da želite početi ispočetka?"]} onClose={this.togglePopupConfirm} onOk={this.restart} />}
            </div>
        )
    }

    restart() {
        let currentUser = this.state.currentUser;
        if (currentUser) {
            FormService.restartForm(this.props.formId)
                .then(() => {
                    window.location.reload();
                })
                .catch(response => {
                    let messages = [];
                    if (response.status && response.error) messages.push(response.status + " " + response.error);
                    if (response.message) messages.push(response.message);
                    this.togglePopup(messages);
                }
                );
        } else {
            window.location.reload();
        }
    }
}
