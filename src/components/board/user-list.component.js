

import React, { Component } from "react";
import UserService from "../../services/user.service";
import { dateFormatShort } from "../../constants/date-format";
import ScoreUtil from "../../utils/score.util";
import DateUtil from "../../utils/date.util";
import "./admin.css";

let columnIndexDate = 1;

export default class UserList extends Component {
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
            sortTable(1, false);
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
          <tbody id="tbody">
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
function sortTable(idx, order) {
  index = idx;
  if (order != null) toggleBool = order;
  if (toggleBool) {
    toggleBool = false;
  } else {
    toggleBool = true;
  }
  let tbody = document.getElementById("tbody");
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

  if (index === columnIndexDate) {
    return DateUtil.compareDateStrings(aVal, bVal);
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
  let tbody = document.getElementById("tbody");
  let tbodyLength = tbody.rows.length;
  if (tbodyLength < rowsPerPage) return;
  let numOfPages = 0;
  if (tbodyLength % rowsPerPage === 0) {
    numOfPages = tbodyLength / rowsPerPage;
  }
  if (tbodyLength % rowsPerPage >= 1) {
    numOfPages = tbodyLength / rowsPerPage;
    numOfPages++;
    numOfPages = Math.floor(numOfPages++);
  }
  let pageList = [];
  pageList.push(1);

  let currentPage = parseInt(document.getElementById("current-page").label, 10);

  for (let i = -1; i <= 1; i++) {
    if (currentPage + i > 1 && currentPage + i < numOfPages)
      pageList.push(currentPage + i);
  }

  pageList.push(numOfPages)
  document.getElementById("pagination").innerHTML = "";
  pageList.forEach((p) => {
    // -------------------- BUTTON PREVIOUS --------------------
    if (p === currentPage - 1 && currentPage > 3) {
      let node = createPaginationButton(tbody, "<<", currentPage-2, rowsPerPage);
      document.getElementById('pagination').appendChild(node);
    }

    // -------------------- BUTTON WITH PAGE NUMBER --------------------
    let node = createPaginationButton(tbody, p, p, rowsPerPage);
    if (p === currentPage) node.style.border = "2px solid red";
    document.getElementById('pagination').appendChild(node);


    // -------------------- BUTTON NEXT --------------------
    if (p === currentPage + 1 && currentPage < numOfPages - 2) {
      let node = createPaginationButton(tbody, ">>", currentPage+2, rowsPerPage);
      document.getElementById('pagination').appendChild(node);
    }
  });
  for (let i = 0; i < tbodyLength; i++) {
    if (i < (currentPage - 1) * rowsPerPage || i >= currentPage * rowsPerPage) {
      if (document.getElementById(tbody.rows[i].id)) document.getElementById(tbody.rows[i].id).style.display = "none";
    }
  }
}

function createPaginationButton(tbody, text, page, rowsPerPage) {
  let tbodyLength = tbody.rows.length;
  let node = document.createElement("BUTTON");
  node.className = "button-pagination";
  node.innerText = text;
  node.onclick = function (e) {
    e.preventDefault();
    for (let i = 0; i < tbodyLength; i++) {
      if (document.getElementById(tbody.rows[i].id)) document.getElementById(tbody.rows[i].id).style.display = "none";
    }
    let temp = page - 1;
    let start = temp * rowsPerPage;
    document.getElementById("current-page").label = page;
    for (let j = 0; j < rowsPerPage; j++) {
      let k = start + j;
      if (k < tbodyLength && document.getElementById(tbody.rows[k].id)) document.getElementById(tbody.rows[k].id).style.display = "";
    }
    window.scrollTo(0, document.body.scrollHeight);
    pagination();
  }
  return node;
}
