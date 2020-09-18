import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import MenuButton from "../jamb/button/menu-button.component";
import "./navigation.css";


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
        let currentUser = this.state.currentUser;
        return (
            <div>
                {this.props.showMenu ? <div>
                    <div className="menu">
                        <div className="menu-element" onClick={() => this.props.history.push("/")} style={{ backgroundImage: 'url(/images/misc/logo.png)' }}><strong>Jamb</strong></div>
                        <div className="menu-element" onClick={() => this.props.history.push("/users")}><strong>Korisnici</strong></div>
                        <div className="menu-element" onClick={() => this.props.history.push("/scores")}><strong>Rezultati</strong></div>
                        <div className="menu-element" onClick={() => this.props.history.push("/profile")}><strong>{currentUser && currentUser.username}</strong></div>
                    </div>
                    {this.props.gameMounted && <div className="menu mask" onClick={this.props.onToggleMenu} />}
                    </div>
                 : !this.props.gameMounted && <MenuButton onToggleMenu={this.props.onToggleMenu} gameMounted={this.props.gameMounted} />}

            </div>
        );
    }
}