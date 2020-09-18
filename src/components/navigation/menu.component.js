import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import MenuButton from "../jamb/button/menu-button.component";
import "./navigation.css";


export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAdmin: false,
            showMenu: false
        };
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        this.setState({ showMenu: !this.state.showMenu });
    }

    render() {
        let currentUser = this.props.currentUser;
        let showMenu = this.state.showMenu;
        let history = this.props.history;
        let gameMounted = this.props.gameMounted;
        return (
            <div>
                {showMenu ? <div>
                    <div className="menu">
                        <div className="menu-element" onClick={() => history.push("/")} style={{ backgroundImage: 'url(/images/misc/logo.png)' }}><div className="menu-element-text">Jamb</div></div>
                        <div className="menu-element" onClick={() => history.push("/users")} style={{ backgroundImage: 'url(/images/misc/users.png)' }}><div className="menu-element-text">Korisnici</div></div>
                        <div className="menu-element" onClick={() => history.push("/scores")} style={{ backgroundImage: 'url(/images/misc/scores.png)' }}><div className="menu-element-text">Rezultati</div></div>
                        {currentUser ? 
                        (<div className="menu-element" onClick={() => history.push("/profile")} style={{ backgroundImage: 'url(/images/misc/profile.png)' }}><div className="menu-element-text">{currentUser && currentUser.username}</div></div>) : 
                        (<div className="menu-element" onClick={() => history.push("/login")} style={{ backgroundImage: 'url(/images/misc/login.png)' }}><div className="menu-element-text">Prijava</div></div>)}
                    </div>
                    {gameMounted && <div className="menu mask" onClick={this.toggleMenu} />}
                </div>
                    : <MenuButton onToggleMenu={this.toggleMenu} gameMounted={gameMounted} />}

            </div>
        );
    }
}