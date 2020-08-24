

import React, { Component } from "react";
import UserBoard from "./board-user.component";
import AuthService from "../services/auth.service";
import "./administration.css";

export default class UserListBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiURL: "http://localhost:8080",
      // apiURL: "https://jamb-spring.herokuapp.com",
      currentUser: undefined,
      content: "",
      users: [],
      userVisibility: []
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    this.setState({ currentUser: currentUser }, () => {
      this.getUsers();
    });
  }

  getUsers() {
    var http = new XMLHttpRequest();
    var url = this.state.apiURL + '/users';
    let currentUser = this.state.currentUser;
    http.open('GET', url, true);
    http.setRequestHeader('Authorization', currentUser.tokenType + " " + currentUser.accessToken);
    http.addEventListener('load', () => {
      if (http.readyState === 4 && http.status === 200) {
        let users = JSON.parse(http.responseText);
        console.log(users);
        this.setState(state => {
          for (let user in users) {
            state.userVisibility[users[user].id] = false;
          }
        });
        this.setState({
          users: users.map((user) => {
            return <tr key={user.id}>
              <td>
                {user.id}
              </td>
              <td>
                {user.username}
              </td>
              <td>
                <button className="btn btn-info btn-margin">Detalji</button>
                <button className="btn btn-warning btn-margin">Uredi</button>
                <button className="btn btn-danger btn-margin">Izbriši</button>
              </td>
            </tr>
          })
        });
      }
    });
    http.send();
  }

  render() {
    return (
      <div>
        <h3>Korisnici:</h3>
      <div className="users">
        <table className="table">
          <tbody>
            <tr>
              <th>ID</th>
              <th>Korisničko ime</th>
            </tr>
            {this.state.users}
          </tbody>
        </table>
        <div className="details">Strana</div>
      </div></div>
      
    );
  }
}