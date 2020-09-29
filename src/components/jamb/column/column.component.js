import React, { Component } from "react";
import Box from "../box/box.component";
import "./column.css";

export default class Column extends Component {

    render() {
        const columnTypeId = this.props.variables.columnType.id;
        
        return (
            <div className="column">
                <div />
            </div>
        )
    }
}
