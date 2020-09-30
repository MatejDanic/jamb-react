import React, { Component } from "react";
import "../../../constants/colors.css";
import "./label.css";

export default class Label extends Component {
    render() {
        let display = this.props.number == null ? this.props.value : this.props.number;
        return (
            <div className={this.props.labelClass} style={{ backgroundImage: 'url(' + this.props.imgUrl + ')' }}>
                {display}
            </div>
        )
    }
}
