import React, { Component } from "react";
// components
import PopupConfirm from "../../popup/popup-confirm.component";
// services
import AuthService from "../../../services/auth.service";
import FormService from "../../../services/form.service";
// styles
import "../../../constants/colors.css";
import "./button.css";

export default class QuitButton extends Component {

    constructor() {
        super();
        this.state = {
            currentUser: undefined,
            showPopupConfirm: false
        }
        this.togglePopupConfirm = this.togglePopupConfirm.bind(this);
        this.quit = this.quit.bind(this);
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
            <div className="form-button bg-lightpink restart" style={{ backgroundImage: 'url(/images/misc/logout.png)' }} onClick={this.togglePopupConfirm} >
                {this.state.showPopupConfirm && <PopupConfirm text={["Jeste li sigurni da želite odustati od izazova?"]} onClose={this.togglePopupConfirm} onOk={this.quit} />}
            </div>
        )
    }

    quit() {
        let currentUser = this.state.currentUser;
        if (currentUser) {
            this.props.onQuit();
        } else {
            window.location.reload();
        }
    }
}
