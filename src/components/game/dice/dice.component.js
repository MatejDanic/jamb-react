import React, { Component } from "react";
import "./dice.css";
import "./dice-animation.css";

export default class Dice extends Component {
    render() {
        let dice = this.props.dice;
        let diceDisabled = this.props.diceDisabled;
        let btnClass = diceDisabled ? "dice-gray-border" : dice.hold ? "dice-red-border" : "dice-black-border";
        let imgUrl = 'url(images/dice/' + dice.value + '.bmp)';

        return (
            <button id={"dice" + dice.ordinalNumber} disabled={diceDisabled} className={"dice-button " + btnClass} onClick={() => this.props.onToggleDice(dice.ordinalNumber)} style={{ backgroundImage: imgUrl }} />
        )
    }
}
