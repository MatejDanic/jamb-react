import React, { Component } from "react";
// services
import AuthService from "../../services/auth.service";
// styles
import "./navigation.css";

export default class Bar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined,
            showAdmin: false
        };
    }

    componentDidMount() {
        let currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser });
    }

    render() {
        let currentUser = this.state.currentUser;
        let history = this.props.history;
        return (
            <div className="bar">
                <div className="bar-left">
                    <button className="bar-element" onClick={() => history.push("/")}>Jamb</button>

                    <button className="bar-element" onClick={() => history.push("/users")}>Igrači</button>

                    <button className="bar-element" onClick={() => history.push("/scores")}>Rezultati</button>

                </div>
                {currentUser ? (
                    <div className="bar-right">
                        <button className="bar-element" onClick={() => history.push("/profile")}>{currentUser.username}</button>

                        <button className="bar-element" onClick={this.props.onLogout}>Odjava</button>
                    </div>
                ) : (
                    <div className="bar-right">
                        <button className="bar-element" onClick={() => history.push("/login")}>Prijava</button>

                        <button className="bar-element" onClick={() => history.push("/register")}>Registracija</button>
                    </div>)}
            </div>
        );
    }
}
