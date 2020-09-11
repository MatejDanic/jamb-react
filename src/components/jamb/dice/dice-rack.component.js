import React, { Component } from "react";
import Dice from "./dice.component";
import "./dice-rack.css";

export default class DiceRack extends Component {

    render() {
        let dice = this.props.dice;
        let diceDisabled = this.props.diceDisabled;
        return (
            <div className="dice-rack">
                <Dice disabled={diceDisabled} variables={dice[0]} onToggleDice={this.props.onToggleDice.bind(this)} />
                <Dice disabled={diceDisabled} variables={dice[1]} onToggleDice={this.props.onToggleDice.bind(this)} />
                <Dice disabled={diceDisabled} variables={dice[2]} onToggleDice={this.props.onToggleDice.bind(this)} />
                <Dice disabled={diceDisabled} variables={dice[3]} onToggleDice={this.props.onToggleDice.bind(this)} />
                <Dice disabled={diceDisabled} variables={dice[4]} onToggleDice={this.props.onToggleDice.bind(this)} />
            </div>
        )
    }
}