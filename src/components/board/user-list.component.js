

import React, { Component } from "react";
import UserService from "../../services/user.service";
import { dateFormatShort } from "../../constants/date-format";
import DateUtil from "../../utils/date.util";
import { pagination } from "../../utils/pagination.util";
import { sortTable } from "../../utils/sort.util";
import "./board.css";

export default class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    UserService.getUsers().then(
      response => {
        let users = [];
        for (let key in response.data) {
          users.push(response.data[key]);
        }
        this.setState({ users: users }, () => {
          sortTable(1, false);
          pagination();
        });
      },
      error => {
        console.log(error.response && error.response.data);
      }
    );
    document.getElementById("current-page").label = 1;
  }

  render() {
    let users = this.state.users;
    return (
      <div className="container-custom">
        <div className="container-custom-table">
          <table className="custom-table">
            <thead>
              <tr>
                <th onClick={() => sortTable(0)}>Ime</th>
                <th onClick={() => sortTable(1)}>Zadnja igra</th>
                <th onClick={() => sortTable(2)}>Odigrano</th>
              </tr>
            </thead>
            <tbody id="tbody">
              {users.map(user =>
                <tr key={user.id} id={user.id} onClick={() => { this.props.history.push("/users/" + user.id) }}>
                  <td>{user.username}</td>
                  <td>{user.scores.length === 0 ? "-----" : dateFormatShort.format(DateUtil.getLastScoreDate(user.scores))}</td>
                  <td>{user.scores.length}</td>
                </tr>)}
            </tbody>
          </table>
          <div className="container-pagination">
            <div id="pagination" />
          </div>
          <div id="current-page" />
        </div>
      </div>
    );
  }
}