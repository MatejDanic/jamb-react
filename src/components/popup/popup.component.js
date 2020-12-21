import React, { Component } from "react";
import "./popup.css";

export default class Popup extends Component {

    componentDidMount() {
        let trumpets = new Audio("/sounds/misc/trumpets.mp3");
        trumpets.volume = 0.1
        trumpets.play();
    }

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