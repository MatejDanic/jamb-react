import React, { Component } from "react";
// services
import AuthService from "../../../services/auth.service";
// styles
import "../../../constants/colors.css";
import "./button.css";

export default class ProfileButton extends Component {

    constructor() {
        super();
        this.state = {
            currentUser: undefined
        }
    }

    componentDidMount() {
        let currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser });
    }

    render() {
        let currentUser = this.state.currentUser;
        return (
            <div>
                {currentUser ? <button className="button form-button profile" onClick={() => this.props.history.push("/profile")}>{currentUser.username}</button> :
                    <div className="button form-button profile">Gost</div>}
            </div>
        )
    }
}
