import React, { Component } from "react";
import "./button.css"

export default class RollDiceButton extends Component {

  render() {
    let rollDisabled = this.props.rollDisabled;
    let btnClass = this.getBtnClass(this.props.rollCount);
    return (
      <button disabled={rollDisabled} className={"button roll-dice bg-light-pink " + btnClass} style={{ backgroundImage: 'url(/images/misc/roll_dice.png)' }} onClick={this.props.onRollDice}></button>
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
