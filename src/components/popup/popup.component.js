import React, { Component } from "react";
import "./popup.css";

export default class Popup extends Component {

    render() {
        let cancel = this.props.cancel;
        return (
            <div className="popup">
                <div className="popup-inner">
                    <h2>{this.props.text}</h2>
                    <button className="popup-button" onClick={this.props.closePopup}>Ok</button>
                    {cancel && <button className="popup-button" onClick={cancel}>Zatvori</button>}
                </div>
            </div>
        );
    }
}