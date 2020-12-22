import React, { Component } from "react";
import "./popup.css";

export default class Popup extends Component {
    render() {
        return (
            <div className="popup">
                <div className="popup-inner">
                    <h1>{this.props.text}</h1>
                    <button className="button-ok" onClick={this.props.closePopup}>OK</button>
                </div>
            </div>
        );
    }
}