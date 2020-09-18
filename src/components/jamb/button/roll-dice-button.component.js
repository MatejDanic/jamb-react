import React, { Component } from "react";
import "./roll-dice-button.css"

export default class RollDiceButton extends Component {

  render() {
    let disabled = this.props.disabled;
    let btnClass = this.getBtnClass(this.props.rollsLeft);
    return (
      <button disabled={disabled} className={"roll-dice-button " + btnClass} onClick={this.props.onRollDice}>K O C K I C E</button>
    )
  }

  getBtnClass(rollsLeft) {
    var btnClass;
    switch (rollsLeft) {
      case 0:
        btnClass = 'none-left';
        break;
      case 1:
        btnClass = 'one-left';
        break;
      case 2:
        btnClass = 'two-left';
        break;
      default:
        btnClass = "";
    }
    return btnClass;
  }
}
