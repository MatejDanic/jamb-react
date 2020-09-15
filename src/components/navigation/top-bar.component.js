import React, { Component } from "react";
import AuthService from "../../services/auth.service";

export default class TopBar extends Component {

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
        const { currentUser, showAdmin } = this.state;
        return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark" style={{ height: '5vh' }}>
                    <div className="navbar-nav mr-auto">
                        {this.props.links.jamb}
                        {showAdmin && (
                            <li className="nav-item">
                                {this.props.links.admin}
                            </li>
                        )}
                    </div>
                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                            </li>
                            <li className="nav-item">
                                {this.props.links.profile}
                            </li>
                            <li className="nav-item">
                                {this.props.links.logout}
                            </li>
                        </div>
                    ) : (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    {this.props.links.login}
                                </li>
                                <li className="nav-item">
                                    {this.props.links.register}
                                </li>
                            </div>
                        )}
                </nav>
            </div>
        );
    }
}
