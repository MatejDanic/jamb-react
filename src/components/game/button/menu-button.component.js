import React, { Component } from "react";
import "./button.css";
import "../../../constants/colors.css";

export default class MenuButton extends Component {

    render() {
        return (
            <div>
                {this.props.smallWindow ? <button className="form-button menu-button bg-light-pink" style={{ backgroundImage: 'url(/images/misc/cog.png)' }} onClick={this.props.onToggleMenu}></button> : 
                <div className="form-button bg-light-pink"><a href="https://github.com/MatejDanic">PROJEKT</a></div>}
            </div>
        );
    }
}
