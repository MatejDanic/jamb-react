import React, { Component } from "react";
import "../../../constants/colors.css";

export default class MenuButton extends Component {

    render() {
        let className = "menu-button bg-light-pink " + (this.props.gameMounted ? "menu-button-form" : "menu-button-free");
        return (
            <div>
                <button className={className} style={{ backgroundImage: 'url(/images/misc/cog.png)' }} onClick={this.props.onToggleMenu}></button>
            </div>
        );
    }
}
