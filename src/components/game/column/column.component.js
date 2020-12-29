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
                <Label labelClass={"label label-image bg-white"} imgUrl={"../images/column/" + column.columnType.label + ".png"} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[0]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[1]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[2]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[3]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[4]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[5]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Label labelClass={"label number bg-lightskyblue"} number={sums[column.columnType.label + "-numberSum"]}
                    id={column.columnType.label + "-numberSum"} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[6]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[7]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Label labelClass={"label number bg-lightskyblue"} number={sums[column.columnType.label + "-diffSum"]}
                    id={column.columnType.label + "-diffSum"} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[8]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[9]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[10]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[11]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Box gameInfo={gameInfo} annCol={annCol} box={column.boxes[12]}
                    onBoxClick={(boxType) => this.props.onBoxClick(column.columnType, boxType)} />
                <Label labelClass={"label number bg-lightskyblue"} number={sums[column.columnType.label + "-labelSum"]}
                    id={column.columnType.label + "-labelSum"} />
            </div>
        )
    }
}
