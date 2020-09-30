import React, { Component } from "react";
import "./button.css";
import "../../../constants/colors.css";

export default class MenuButton extends Component {

    render() {
        return (
            <div>
                <button className="menu-button bg-light-pink" style={{ backgroundImage: 'url(/images/misc/cog.png)' }} onClick={this.props.onToggleMenu}></button>
            </div>
        );
    }
}
