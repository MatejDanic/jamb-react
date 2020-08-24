import React, { Component } from "react";
import "./box.css";

export default class Box extends Component {
    
    render() {
        const label = this.props.variables.label;
        let disabled = this.getDisabled()
        let btnClass = this.getBtnClass(disabled);
        let value = this.props.variables.filled ? this.props.variables.value : "";
        return (
            <button label={label} disabled={disabled} className={"box " + btnClass} onClick={() => this.props.onBoxClick(label)} >{value}</button>
        )
    }

    getDisabled() {
        var disabled;
        if (this.props.gameInfo[2] === 3) return true;
        if (this.props.gameInfo[0] != null) {
            disabled = this.props.variables.label !== this.props.gameInfo[0];
        } else if (this.props.gameInfo[2] >= 2) {
            disabled = this.props.gameInfo[1] || !this.props.variables.available;
        } else {
            disabled = this.props.variables.label >= 39 || this.props.gameInfo[1] || !this.props.variables.available;
        }
        return disabled;
    }

    getBtnClass(disabled) {
        let btnClass = "";
        const label = this.props.variables.label;
        btnClass = this.props.gameInfo[0] === label ? "red-border" : "";
        if (disabled) btnClass += "gray-border";
        return btnClass;
    }
}
