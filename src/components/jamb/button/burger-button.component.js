import React, { Component } from "react";
import "../../../constants/colors.css";

export default class BurgerButton extends Component {
    render() {
        return (
            <div>
                <button className="form-button bg-light-pink" onClick={this.props.onToggleBurgerMenu}>Menu</button>
            </div>
        );
    }
}
