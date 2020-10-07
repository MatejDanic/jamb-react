import React, { Component } from "react";
import "./button.css";
import "../../../constants/colors.css";

export default class MenuButton extends Component {

    render() {
        return (
            <div>
                {this.props.smallWindow ? <button className="form-button menu-button bg-light-pink" style={{ backgroundImage: 'url(/images/misc/cog.png)' }} onClick={this.props.onToggleMenu}></button> : 
                <a className="form-button menu-button bg-light-pink" href="https://github.com/MatejDanic">Projekt</a>}
            </div>
        );
    }
}
