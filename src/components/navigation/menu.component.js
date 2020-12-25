import React, { Component } from "react";
// services
import AuthService from "../../services/auth.service";
// styles
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

    componentDidUpdate() {
        let currentUser = AuthService.getCurrentUser();
        if (!this.state.currentUser && AuthService.getCurrentUser() || this.state.currentUser && !AuthService.getCurrentUser()) this.setState({ currentUser });
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
                            <div className="menu-element" onClick={() => history.push("/")} style={{ backgroundImage: 'url(/images/misc/dice.png)' }}><div className="menu-element-text">Jamb</div></div>
                            <div className="menu-element" onClick={() => history.push("/users")} style={{ backgroundImage: 'url(/images/misc/users.png)' }}><div className="menu-element-text">Igrači</div></div>
                            <div className="menu-element" onClick={() => history.push("/scores")} style={{ backgroundImage: 'url(/images/misc/scores.png)' }}><div className="menu-element-text">Rezultati</div></div>
                            {currentUser ?
                                (<div className="menu-element" onClick={this.props.onLogout} href="/login" style={{ backgroundImage: 'url(/images/misc/logout.png)' }}><div className="menu-element-text">Odjava</div></div>) :
                                (<div className="menu-element" onClick={() => history.push("/login")} style={{ backgroundImage: 'url(/images/misc/login.png)' }}><div className="menu-element-text">Prijava</div></div>)}
                        </div>
                    </div>}
            </div>
        );
    }
}