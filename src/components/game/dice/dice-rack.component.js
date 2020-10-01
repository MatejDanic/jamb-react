import React, { Component } from "react";
import Dice from "./dice.component";

export default class DiceRack extends Component {

    render() {
        let dice = this.props.dice;
        let diceDisabled = this.props.diceDisabled || this.props.rollDisabled;
        return (
            <div>
                <Dice diceDisabled={diceDisabled} dice={dice[0]} onToggleDice={this.props.onToggleDice} />
                <Dice diceDisabled={diceDisabled} dice={dice[1]} onToggleDice={this.props.onToggleDice} />
                <Dice diceDisabled={diceDisabled} dice={dice[2]} onToggleDice={this.props.onToggleDice} />
                <Dice diceDisabled={diceDisabled} dice={dice[3]} onToggleDice={this.props.onToggleDice} />
                <Dice diceDisabled={diceDisabled} dice={dice[4]} onToggleDice={this.props.onToggleDice} />
            </div>
        )
    }
}