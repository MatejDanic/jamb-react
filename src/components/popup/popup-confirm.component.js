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
                            {text && text.map(line => <li key={line}>{line}</li>)}
                            </ul>
                        </div>

                        <button className="popup-button" onClick={this.props.onOk} style={{ backgroundImage: 'url(/images/misc/yes.png)' }}/>
                        <button className="popup-button" onClick={this.props.onClose} style={{ backgroundImage: 'url(/images/misc/no.png)' }}/>
                    </div>
                </div>
            </div>
        );
    }
}