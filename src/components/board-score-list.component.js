

import React, { Component } from "react";
import ScoreService from "../services/score.service";
import "./administration.css";

export default class ScoreListBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      scores: []
    };
  }

  componentDidMount() {
    ScoreService.getScores().then(
      response => {
        this.setState({
          content: response.data,
          scores: []
        }, () => {
          for (let key in this.state.content) {
            this.setState(state => {
              state.scores.push(this.state.content[key]);
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
    let scores = this.state.scores;
    const dateFormat = new Intl.DateTimeFormat('UK', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return (
      <div className="container-custom">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th onClick={() => sortTable(0)}>ID</th>
              <th onClick={() => sortTable(1)}>Korisnik</th>
              <th onClick={() => sortTable(2)}>Datum</th>
              <th onClick={() => sortTable(3)}>Vrijednost</th>
            </tr>
          </thead>
          <tbody id="tbody-scores">
            {scores && scores.map(score =>
            <tr key={score.id} onClick={() => { this.props.history.push("/scores/" + score.id) }}>
              <td>{score.id}</td>
              <td>{score.user.username}</td>
              <td>{dateFormat.format(new Date(score.date))}</td>
              <td>{score.value}</td>
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