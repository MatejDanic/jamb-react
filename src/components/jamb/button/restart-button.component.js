import React, { Component } from "react";
import FormService from "../../../services/form.service";
import "./button.css";
import "../../../constants/colors.css";

export default class RestartButton extends Component {

  render() {
    return (
      <button className="form-button bg-light-pink restart" style={{ backgroundImage: 'url(/images/misc/restart.png)' }} onClick={() => { if (window.confirm('Jeste li sigurni da želite početi ispočetka?')) this.handleClick() }}></button>
    )
  }

  handleClick() {
    if (this.props.currentUser) {
      FormService.deleteForm(this.props.formId).then(
        () => {
          window.location.reload();
        },
        error => {
          window.location.reload();
          console.log(error);
        }
      );
    } else {
      window.location.reload();
    }
  }
}
