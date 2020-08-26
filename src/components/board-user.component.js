import React, { Component } from "react";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

export default class UserBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      content: ""
    };
  }

  componentDidMount() {
    this.setState({ currentUser: AuthService.getCurrentUser() });
    UserService.getUser(this.props.match.params.userId).then(
      response => {
        this.setState({ content: response.data });
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteUser() {
    UserService.deleteUser(this.props.match.params.userId).then(
      response => {
        this.props.history.push("/users");
      },
      error => {
        console.log(error);
      }
    );
  }

  editUser() {
    console.log("edit");
  }

  render() {
    let user = this.state.content;
    let currentUser = this.state.currentUser;
    let scores = user.scores;
    const dateFormat = new Intl.DateTimeFormat('UK', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return (
      <div className="container-custom">
        {currentUser && currentUser.roles.includes("ADMIN") && <div className="container-button">
          <button className="btn btn-warning button-admin" onClick={() => this.editUser()}>Uredi</button>
          <button className="btn btn-danger button-admin" onClick={() => { if (window.confirm('Jeste li sigurni da izbrisati ovog korisnika?')) this.deleteUser() }}>Izbriši</button>
        </div>}

        <div className="container-custom-inner">
          <h3>
            <strong>Korisničko ime: </strong>
            <strong>{user.username}</strong>
          </h3>
          <p>
            <strong>ID: </strong>
            {user.id}
          </p>
          <strong>Uloge:</strong>
          <ul>
            {user.roles &&
              user.roles.map((role, id) => <li key={id}>{role.label}</li>)}
          </ul>
        </div>

        <strong>Rezultati</strong>
        {user.scores && <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th onClick={() => sortTable(0)}>ID</th>
              <th onClick={() => sortTable(1)}>Datum</th>
              <th onClick={() => sortTable(2)}>Vrijednost</th>
            </tr>
          </thead>
          <tbody id="tbody-scores">
            {scores && scores.map(score =>
              <tr key={score.id} onClick={() => { this.props.history.push("/scores/" + score.id) }}>
                <td>{score.id}</td>
                <td>{dateFormat.format(new Date(score.date))}</td>
                <td>{score.value}</td>
              </tr>)}
          </tbody>
        </table>}
      </div>
    );
  }
}

let index;      // cell index
let toggleBool; // sorting asc, desc 
function sortTable(idx) {
  index = idx;
  if (toggleBool) {
    toggleBool = false;
  } else {
    toggleBool = true;
  }
  let tbody = document.getElementById("tbody-scores");
  let datas = [];
  let tbodyLength = tbody.rows.length;
  for (let i = 0; i < tbodyLength; i++) {
    datas[i] = tbody.rows[i];
  }

  // sort by cell[index] 
  datas.sort(compareCells);
  for (let i = 0; i < tbody.rows.length; i++) {
    // rearrange table rows by sorted rows
    tbody.appendChild(datas[i]);
  }
}

function compareCells(a, b) {
  let aVal = a.cells[index].innerText;
  let bVal = b.cells[index].innerText;

  aVal = aVal.replace(/,/g, '');
  bVal = bVal.replace(/,/g, '');

  if (toggleBool) {
    let temp = aVal;
    aVal = bVal;
    bVal = temp;
  }

  if (aVal.match(/^[0-9]+$/) && bVal.match(/^[0-9]+$/)) {
    return parseFloat(aVal) - parseFloat(bVal);
  }
  else {
    if (aVal < bVal) {
      return -1;
    } else if (aVal > bVal) {
      return 1;
    } else {
      return 0;
    }
  }
}