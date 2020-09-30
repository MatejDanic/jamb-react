import React, { Component } from "react";
import "./box.css";

export default class Box extends Component {

    render() {
        let box = this.props.box;
        let gameInfo = this.props.gameInfo;
        let disabled = this.getDisabled(box, gameInfo);
        let btnClass = this.getBtnClass(disabled);
        let value = box.filled ? box.value : "";
        return (
            <button disabled={disabled} className={"box " + btnClass} onClick={() => this.props.onBoxClick(box.boxType.id)}>{value}</button>
        )
    }

    getDisabled(box, gameInfo) {
        let disabled = gameInfo.rollCount === 0;
        let annCol = this.props.annCol;
        if (!disabled) {
            if (gameInfo.announcement != null) {
                disabled = gameInfo.announcement !== box.boxType.Id;
            } else {
                disabled = gameInfo.rollCount >= 2 && annCol;
            }
        }
        disabled = disabled || !box.available;
        return disabled;
    }

    getBtnClass(disabled) {
        let btnClass = "";
        let box = this.props.box;
        btnClass = this.props.gameInfo[0] === box.filled ? "red-border" : "";
        if (disabled) btnClass += "gray-border";
        return btnClass;
    }
}
