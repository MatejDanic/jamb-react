import React, { Component } from "react";
// services
import AuthService from "../../services/auth.service";
// stylesheets
import "./navigation.css";

export default class Menu extends Component {  

    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined
        };
    }

    componentDidMount() {
        let currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser });
    }

    render() {
        let currentUser = this.state.currentUser;
        let showMenu = this.props.showMenu;
        let history = this.props.history;
        let gameMounted = this.props.gameMounted;
        let menuClass = gameMounted ? "menu-relative" : "menu-fixed";
        return (
            <div>
                {(!gameMounted || showMenu) &&
                    <div className="front">
                        {gameMounted && <div className="mask" onClick={this.props.onToggleMenu} />}
                        <div className={"menu " + menuClass}>
                            <div className="menu-element" onClick={() => history.push("/")} style={{ backgroundImage: 'url(/images/misc/logo.png)' }}><div className="menu-element-text">Jamb</div></div>
                            <div className="menu-element" onClick={() => history.push("/users")} style={{ backgroundImage: 'url(/images/misc/users.png)' }}><div className="menu-element-text">Korisnici</div></div>
                            <div className="menu-element" onClick={() => history.push("/scores")} style={{ backgroundImage: 'url(/images/misc/scores.png)' }}><div className="menu-element-text">Rezultati</div></div>
                            {currentUser ?
                                (<div className="menu-element" onClick={() => history.push("/profile")} style={{ backgroundImage: 'url(/images/misc/profile.png)' }}><div className="menu-element-text">{currentUser && currentUser.username}</div></div>) :
                                (<div className="menu-element" onClick={() => history.push("/login")} style={{ backgroundImage: 'url(/images/misc/login.png)' }}><div className="menu-element-text">Prijava</div></div>)}
                        </div>
                    </div>}
            </div>
        );
    }
}