

import React, { Component } from "react";
import UserService from "../services/user.service";
import { dateFormatShort } from "../misc/date-format";
import ScoreUtil from "../utils/score.util";
import DateUtil from "../utils/date.util";
import "./administration.css";

export default class UserListBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      users: []
    };
  }

  componentDidMount() {
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
          this.setState({}, () => {
            sortTable(1);
            pagination();
          });
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
      <div className="container-custom" id="pagination">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th onClick={() => sortTable(0)}>Korisničko ime</th>
              <th onClick={() => sortTable(1)}>Posljednja igra</th>
              <th onClick={() => sortTable(2)}>Najveći rezultat</th>
            </tr>
          </thead>
          <tbody id="tbody-users">
            {users.map(user =>
              <tr key={user.id} id={user.id} onClick={() => { this.props.history.push("/users/" + user.id) }}>
                <td>{user.username}</td>
                <td>{user.scores.length === 0 ? "-----" : dateFormatShort.format(DateUtil.getLastScoreDate(user.scores))}</td>
                <td>{ScoreUtil.getHighScore(user.scores)}</td>
              </tr>)}
          </tbody>
        </table>
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
  let tbody = document.getElementById("tbody-users");
  let datas = [];
  let tbodyLength = tbody.rows.length;
  for (let i = 0; i < tbodyLength; i++) {
    document.getElementById(tbody.rows[i].id).style.display = "";
  }
  for (let i = 0; i < tbodyLength; i++) {
    datas[i] = tbody.rows[i];
  }
  // sort by cell[index] 
  datas.sort(compareCells);
  for (let i = 0; i < tbody.rows.length; i++) {
    // rearrange table rows by sorted rows
    tbody.appendChild(datas[i]);
  }
  pagination();
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
    aVal = aVal.toLowerCase();
    bVal = bVal.toLowerCase();
    if (aVal < bVal) {
      return -1;
    } else if (aVal > bVal) {
      return 1;
    } else {
      return 0;
    }
  }
}

function pagination() {
  let rowsPerPage = 10;
  let tbody = document.getElementById("tbody-users");
  if (tbody.rows.length < rowsPerPage) return;
  let numOfPages = 0;
  if (tbody.rows.length % rowsPerPage === 0) {
    numOfPages = tbody.rows.length / rowsPerPage;
  }
  if (tbody.rows.length % rowsPerPage >= 1) {
    numOfPages = tbody.rows.length / rowsPerPage;
    numOfPages++;
    numOfPages = Math.floor(numOfPages++);
  }
  if (document.getElementsByClassName("button-pagination").length === 0) {
    for (let i = 1; i <= numOfPages; i++) {
      let node = document.createElement("BUTTON");
      node.className = "button-pagination";
      node.innerText = i;
      node.onclick = function (e) {
        e.preventDefault();
        for (let i = 0; i < tbody.rows.length; i++) {
          document.getElementById(tbody.rows[i].id).style.display = "none";
        }
        let page = e.target.innerText;
        let temp = page - 1;
        let start = temp * rowsPerPage;
        for (let j = 0; j < rowsPerPage; j++) {
          let k = start + j;
          if (k < tbody.rows.length) document.getElementById(tbody.rows[k].id).style.display = "";
        }
        window.scrollTo(0, document.body.scrollHeight);
      }
      document.getElementById('pagination').appendChild(node);
    }
  }
  for (let i = 0; i < tbody.rows.length; i++) {
    if (i + 1 > rowsPerPage) {
      document.getElementById(tbody.rows[i].id).style.display = "none";
    }
  }
}
