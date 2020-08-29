

import React, { Component } from "react";
import ScoreService from "../services/score.service";
import "./administration.css";
import { dateFormatShort } from "../services/date-format";

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
    return (
      <div className="container-custom">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th onClick={() => sortTable(0)}>Datum</th>
              <th onClick={() => sortTable(1)}>Korisnik</th>
              <th onClick={() => sortTable(2)}>Vrijednost</th>
            </tr>
          </thead>
          <tbody id="tbody-scores">
            {scores && scores.map(score =>
              <tr key={score.id} onClick={() => { this.props.history.push("/scores/" + score.id) }}>
                <td>{dateFormatShort.format(Date.UTC(score.date[0], score.date[1], score.date[2], score.date[3], score.date[4]))}</td>
                <td>{score.user.username}</td>
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