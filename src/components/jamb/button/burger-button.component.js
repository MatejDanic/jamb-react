import React, { Component } from "react";

export default class BurgerButton extends Component {
    render() {
        return (
            <div>
                <button className="form-button" onClick={this.props.onToggleBurgerMenu}>Menu</button>
            </div>
        );
    }
}
