import React, { Component } from "react";
import Box from "../box/box.component";
import Label from "../label/label.component";
import "./column.css";

export default class Column extends Component {

    render() {
        let column = this.props.column;
        let annCol = column.columnType.label === "ANNOUNCEMENT";
        let sums = this.props.gameInfo.sums;
        let gameInfo = this.props.gameInfo;
        return (
            <div className="column">
                <Label labelClass={"label label-image bg-white"} imgUrl={"../images/field/" + column.columnType.label + ".bmp"} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[0]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[1]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[2]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[3]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[4]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[5]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Label labelClass={"label number bg-light-sky-blue"} number={sums[column.columnType.label + "-numberSum"]}
                    id={column.columnType.label + "-numberSum"} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[6]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[7]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Label labelClass={"label number bg-light-sky-blue"} number={sums[column.columnType.label + "-diffSum"]}
                    id={column.columnType.label + "-diffSum"} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[8]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[9]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[10]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[11]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[12]}
                    onBoxClick={(boxTypeId) => this.props.onBoxClick(column.columnType.id, boxTypeId)} />
                <Label labelClass={"label number bg-light-sky-blue"} number={sums[column.columnType.label + "-labelSum"]}
                    id={column.columnType.label + "-labelSum"} />
            </div>
        )
    }
}
