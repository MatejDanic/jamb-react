import React, { Component } from "react";
import "../../../constants/colors.css";

export default class MenuButton extends Component {
    render() {
        return (
            <div>
                <button className="form-button bg-light-pink menu-button" style={{ backgroundImage: 'url(/images/misc/cog.png)' }} onClick={this.props.onToggleMenu}></button>
            </div>
        );
    }
}
