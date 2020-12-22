import React, { Component } from "react";
import "./popup.css";

export default class Popup extends Component {

    render() {
        let text = this.props.text;
        return (
            <div className="popup">
                <div className="popup-inner">
                    <div className="popup-text">
                        <h2>
                            <ul className="scoreboard">
                                {text.map(line => <li key={line}>{line}</li>)}
                            </ul>
                        </h2>
                    </div>
                    <button className="popup-button" onClick={this.props.onOk}>OK</button>
                    {this.props.onClose && <button className="popup-button" onClick={this.props.onClose}>Zatvori</button>}
                </div>
            </div>
        );
    }
}