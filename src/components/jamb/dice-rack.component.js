import React, { Component } from "react";
import DiceButton from "./dice-button.component";
import "./game.css";

export default class DiceRack extends Component {

    render() {
        let dice = this.props.dice;
        let diceDisabled = this.props.diceDisabled;
        return (
            <div className="dice-rack">
                <DiceButton disabled={diceDisabled} variables={dice[0]} onToggleDice={this.props.onToggleDice.bind(this)} />
                <DiceButton disabled={diceDisabled} variables={dice[1]} onToggleDice={this.props.onToggleDice.bind(this)} />
                <DiceButton disabled={diceDisabled} variables={dice[2]} onToggleDice={this.props.onToggleDice.bind(this)} />
                <DiceButton disabled={diceDisabled} variables={dice[3]} onToggleDice={this.props.onToggleDice.bind(this)} />
                <DiceButton disabled={diceDisabled} variables={dice[4]} onToggleDice={this.props.onToggleDice.bind(this)} />
            </div>
        )
    }
}