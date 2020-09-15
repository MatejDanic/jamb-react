import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import "./navigation.css";
import "../../constants/colors.css";

export default class Burger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined,
            showAdmin: false
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                showAdmin: user.roles.includes("ADMIN")
            });
        }
    }

    render() {
        // const { currentUser, showAdmin } = this.state;
        return (
            <div className="burger">
                <div className="menu">
                    <div className="top">
                        <div className="link">{this.props.links.jamb}</div>
                        <div className="link">{this.props.links.profile}</div>
                        <div className="link">{this.props.links.users}</div>
                        <div className="link">{this.props.links.scores}</div>
                    </div>
                    <div className="spacing" />
                    <div className="bottom">
                        <div className="link">{this.props.links.admin}</div>
                        <div className="link">{this.props.links.logout}</div>
                    </div>
                </div>
                <div className="menu mask" onClick={this.props.onToggleBurgerMenu}>
                </div>
            </div>
        );
    }
}
