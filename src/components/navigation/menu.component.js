import React, { Component } from "react";
import AuthService from "../../services/auth.service";

export default class Menu extends Component {

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
        return (
            <div>
                <div className="menu">
                    <div className="menu-element">{this.props.links.profile}</div>
                    <div className="menu-element">{this.props.links.users}</div>
                    <div className="menu-element">{this.props.links.scores}</div>
                    <div className="menu-element">{this.props.links.logout}</div>
                </div>
                {this.props.gameMounted && <div className="menu mask" onClick={this.props.onToggleMenu}>
                </div>}
            </div>
        );
    }
}
