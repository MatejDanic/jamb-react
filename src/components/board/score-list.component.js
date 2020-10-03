

import React, { Component } from "react";
import { dateFormatMedium } from "../../constants/date-format";
import ScoreService from "../../services/score.service";
import DateUtil from "../../utils/date.util";
import { pagination } from "../../utils/pagination.util";
import { sortTable } from "../../utils/sort.util";
import "./board.css";

export default class ScoreList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scores: []
    };
  }

  componentDidMount() {
    if (this.props.scores == null) {
      ScoreService.getScores().then(
        response => {
          let scores = [];
          for (let key in response.data) {
            scores.push(response.data[key]);
          }
          this.setState({ scores: scores }, () => {
            sortTable(0, false);
            pagination();
          });

        },
        error => {
          console.log(error.response.data);
        }
      );
    } else {
      let scores = [];
      for (let key in this.props.scores) {
        scores.push(this.props.scores[key]);
      }
      this.setState({ scores: scores }, () => {
        sortTable(0, false);
        pagination();
      });
    }
    document.getElementById("current-page").label = 1;
  }

  render() {
    let scores = this.state.scores;
    return (
      <div className="container-custom container-custom-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => sortTable(0)}>Datum</th>
              <th onClick={() => sortTable(1)}>Ime</th>
              <th onClick={() => sortTable(2)}>Vrijednost</th>
            </tr>
          </thead>
          <tbody id="tbody">
            {scores && scores.map(score =>
              <tr className={"tr"} key={score.id} id={score.id} onClick={() => { this.props.history.push("/scores/" + score.id) }}>
                <td>{dateFormatMedium.format(DateUtil.getDateFromLocalDateTime(score.date))}</td>
                <td>{this.props.username ? this.props.username : score.user.username}</td>
                <td>{score.value}</td>
              </tr>)}
          </tbody>
        </table>
        <div className="container-pagination">
          <div id="pagination" />
        </div>
        <div id="current-page" />
      </div>
    );
  }
}
