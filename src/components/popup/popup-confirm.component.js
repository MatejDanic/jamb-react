import React, { Component } from "react";
import "./popup.css";

export default class PopupConfirm extends Component {

    render() {
        let text = this.props.text;
        return (
            <div className="popup">
                <div className="popup-window">
                    <div className="popup-inner">
                        <div className="popup-text">
                            <ul >
                                {text.map(line => <li key={line}>{line}</li>)}
                            </ul>
                        </div>

                        <button className="popup-button" onClick={this.props.onOk}>OK</button>
                        <button className="popup-button" onClick={this.props.onClose}>Zatvori</button>
                    </div>
                </div>
            </div>
        );
    }
}