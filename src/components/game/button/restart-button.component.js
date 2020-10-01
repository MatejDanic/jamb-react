import React, { Component } from "react";
// services
import AuthService from "../../../services/auth.service";
import FormService from "../../../services/form.service";
// stylesheets
import "./button.css";
import "../../../constants/colors.css";

export default class RestartButton extends Component {

  render() {
    return (
      <button className="form-button bg-light-pink restart" style={{ backgroundImage: 'url(/images/misc/restart.png)' }} onClick={() => { if (window.confirm('Jeste li sigurni da želite početi ispočetka?')) this.handleClick() }}></button>
    )
  }

  handleClick() {
    let currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      FormService.deleteForm(this.props.formId).then(
        () => {
          window.location.reload();
        },
        error => {
          window.location.reload();
          // console.log(error);
        }
      );
    } else {
      window.location.reload();
    }
  }
}
