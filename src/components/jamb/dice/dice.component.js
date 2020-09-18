import React, { Component } from "react";
import "./dice.css";
import "./dice-animation.css";

export default class Dice extends Component {

    render() {
        const label = this.props.variables.ordinalNumber;
        let value = this.props.variables.value;
        let hold = this.props.variables.hold;
        let disabled = this.props.disabled;
        let btnClass = disabled ? "dice-gray-border" : hold ? "dice-red-border" : "dice-black-border";
        let imgUrl = 'url(images/dice/' + value + '.bmp)';

        return (
            <button id={"dice" + label} label={label} disabled={disabled} className={"dice-button " + btnClass} onClick={() => this.props.onToggleDice(label)} style={{ backgroundImage: imgUrl }} />
        )
    }
}
