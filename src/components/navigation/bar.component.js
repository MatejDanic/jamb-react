import React, { Component } from "react";
// services
import AuthService from "../../services/auth.service";

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
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark" style={{ height: '5vh' }}>
                    <div className="navbar-nav mr-auto">
                        <button className="btn bar-element-text" onClick={() => history.push("/")}>Jamb</button>
                        {/* {showAdmin && (
                            <li>
                                <button className="btn bar-element-text" onClick={() => history.push("/admin")}>Administracija</button>
                            </li>
                        )} */}
                        <button className="btn bar-element-text" onClick={() => history.push("/users")}>Korisnici</button>

                        <button className="btn bar-element-text" onClick={() => history.push("/scores")}>Rezultati</button>

                    </div>
                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li>
                                <button className="btn bar-element-text" onClick={() => history.push("/profile")}>{currentUser.username}</button>
                            </li>
                            <li>
                                <button className="btn bar-element-text" onClick={this.props.onLogout}>Odjava</button>
                            </li>
                        </div>
                    ) : (
                            <div className="navbar-nav ml-auto">
                                <li>
                                    <button className="btn bar-element-text" onClick={() => history.push("/login")}>Prijava</button>
                                </li>
                                <li>
                                    <button className="btn bar-element-text" onClick={() => history.push("/register")}>Registracija</button>
                                </li>
                            </div>
                        )}
                </nav>
            </div>
        );
    }
}
