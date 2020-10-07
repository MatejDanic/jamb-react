import React, { Component } from "react";
import "./button.css"

export default class RollDiceButton extends Component {

  render() {
    let rollDisabled = this.props.rollDisabled;
    let btnClass = this.getBtnClass(this.props.rollCount);
    return (
      <button disabled={rollDisabled} className={"button roll-dice bg-light-pink " + btnClass} onClick={this.props.onRollDice}>K<br />O<br />C<br />K<br />I<br />C<br />E<br /></button>
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
