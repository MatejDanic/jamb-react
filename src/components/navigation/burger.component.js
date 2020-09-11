import React, { Component } from "react";
import AuthService from "../../services/auth.service";

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
        const { currentUser, showAdmin } = this.state;
        return (
            <div>
               I am a burger! :P
            </div>
        );
    }
}
