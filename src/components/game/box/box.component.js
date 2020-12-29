import React, { Component } from "react";
import "./box.css";

export default class Box extends Component {

    render() {
        let box = this.props.box;
        let disabled = this.getDisabled();
        let btnClass = this.getBtnClass(disabled);
        let value = box.filled ? box.value : "";
        return (
            <button disabled={disabled} className={"box " + btnClass} onClick={() => this.props.onBoxClick(box.boxType)}>{value}</button>
        )
    }

    getDisabled() {
        let gameInfo = this.props.gameInfo;
        let box = this.props.box;
        let annCol = this.props.annCol;
        let disabled = gameInfo.rollCount === 0;
        if (gameInfo.rollCount >= 1) {
            if (gameInfo.announcement != null) {
                disabled = gameInfo.announcement.id !== box.boxType.id || !annCol;
            } else {
                disabled = (gameInfo.rollCount >= 2 || gameInfo.announcementRequired) && annCol;
            }
        }
        disabled = disabled || !box.available || box.filled;
        return disabled;
    }

    getBtnClass(disabled) {
        let btnClass = "";
        let gameInfo = this.props.gameInfo;
        let box = this.props.box;     
        let annCol = this.props.annCol;
        if (disabled || !box.available || box.filled) btnClass = "box-gray-border";
        if (annCol && gameInfo.announcement != null && gameInfo.announcement.id === box.boxType.id) btnClass = "box-red-border";
        return btnClass;
    }
}
