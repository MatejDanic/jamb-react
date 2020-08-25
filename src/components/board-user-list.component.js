

import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import "./administration.css";

export default class UserListBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      content: "",
      users: []
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    this.setState({ currentUser: currentUser }, () => {
      console.log("User:", this.state.currentUser.username);
    });
    UserService.getUsers().then(
      response => {
        this.setState({
          content: response.data,
          users: []
        }, () => {
          for (let key in this.state.content) {
            this.setState(state => {
              state.users.push(this.state.content[key]);
            });
          }
          this.setState({});
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    let users = this.state.users;
    return (
      <div className="container-custom">
        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Korisničko ime</th>
              <th>Stvoren</th>
              <th>Posljednja igra</th>
              <th></th>
            </tr>
            {users.map(user => <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>TBA</td>
              <td>TBA</td>
              <td className="container-button">
                <button className="btn btn-info button-admin" onClick={() => {this.props.history.push("/users/" + user.id)}}>Detalji</button>
                <button className="btn btn-warning button-admin" onClick={() => {}}>Uredi</button>
                <button className="btn btn-danger button-admin" onClick={() => {}}>Izbriši</button>
              </td>
              </tr>)}
          </tbody>
        </table>
        
      </div>
    );
  }
}