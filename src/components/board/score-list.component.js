

import React, { Component } from "react";
import { dateFormatMedium } from "../../constants/date-format";
import ScoreService from "../../services/score.service";
import DateUtil from "../../utils/date.util";
import "./admin.css";

let columnIndexDate = 0;

export default class ScoreList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      scores: [],
      columnIndexDate: 0,
      columnIndexUsername: 1,
      columnIndexValue: 2,
      currentPage: 1
    };
  }

  componentDidMount() {
    if (this.props.scores == null) {
      ScoreService.getScores().then(
        response => {
          this.setState({
            content: response.data
          }, () => {
            for (let key in this.state.content) {
              this.setState(state => {
                state.scores.push(this.state.content[key]);
              });
            }
            this.setState({}, () => {
              sortTable(this.state.columnIndexDate, false);
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
    } else {
      this.setState({
        content: this.props.scores
      }, () => {
        for (let key in this.state.content) {
          this.setState(state => {
            state.scores.push(this.state.content[key]);
          });
        }
        this.setState({ columnIndexValue: 1 }, () => {
          sortTable(this.state.columnIndexDate, false);
          pagination();
        });
      });
    }
    document.getElementById("current-page").label = 1;
  }

  render() {
    let scores = this.state.scores;
    let columnIndexDate = this.state.columnIndexDate;
    let columnIndexUsername = this.state.columnIndexUsername;
    let columnIndexValue = this.state.columnIndexValue;
    return (
      <div className="container-custom">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th onClick={() => sortTable(columnIndexDate)}>Datum</th>
              {!this.props.scores && <th onClick={() => sortTable(columnIndexUsername)}>Korisnik</th>}
              <th onClick={() => sortTable(columnIndexValue)}>Vrijednost</th>
            </tr>
          </thead>
          <tbody id="tbody">
            {scores && scores.map(score =>
              <tr className={"tr"} key={score.id} id={score.id} onClick={() => { this.props.history.push("/scores/" + score.id) }}>
                <td>{dateFormatMedium.format(DateUtil.getDateFromLocalDateTime(score.date))}</td>
                {!this.props.scores && <td>{score.user.username}</td>}
                <td>{score.value}</td>
              </tr>)}
          </tbody>
        </table>
        <div className="pagination" id="pagination" />
        <div id="current-page" />
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
