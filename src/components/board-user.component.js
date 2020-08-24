import React, { Component } from "react";
import UserService from "../services/user.service";

export default class UserBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    console.log("mounting");
    UserService.getUserBoard(this.props.userId).then(
      response => {
        this.setState({
          content: response.data.scores
        }, () => {
          console.log(this.state.content);
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
    return (
      <div></div>
    );
  }
}
