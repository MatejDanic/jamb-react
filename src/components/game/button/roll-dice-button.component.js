import React, { Component } from "react";
import "./roll-dice-button.css"

export default class RollDiceButton extends Component {

  render() {
    let rollDisabled = this.props.rollDisabled;
    let btnClass = this.getBtnClass(this.props.rollCount);
    return (
      <button disabled={rollDisabled} className={"bg-light-pink roll-dice-button " + btnClass} onClick={this.props.onRollDice}>K O C K I C E</button>
    )
  }

  getBtnClass(rollCount) {
    var btnClass;
    switch (rollCount) {
      case 1:
        btnClass = 'one-roll';
        break;
      case 2:
        btnClass = 'two-rolls';
        break;
      case 3:
        btnClass = 'three-rolls';
        break;
      default:
        btnClass = "";
    }
    return btnClass;
  }
}
