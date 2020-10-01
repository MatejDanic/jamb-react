import React, { Component } from "react";
// components
import DiceRack from "../dice/dice-rack.component";
import Column from "../column/column.component";
import Label from "../label/label.component";
import MenuButton from "../button/menu-button.component";
import Scoreboard from "../scoreboard/scoreboard.component";
import RollDiceButton from "../button/roll-dice-button.component";
import RestartButton from "../button/restart-button.component";
import RulesButton from "../button/rules-button.component";
// services
import AuthService from "../../../services/auth.service";
import FormService from "../../../services/form.service";
import ScoreService from "../../../services/score.service";
// utilities
import ScoreUtil from "../../../utils/score.util";
// constants
import { NUMBERSUM_BONUS, NUMBERSUM_BONUS_THRESHOLD } from "../../../constants/game-constants";
// stylesheets
import "./form.css";

export default class Form extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            form: {},
            filledBoxCount: 0,
            announcementRequired: false,
            rollDisabled: false,
            diceDisabled: true,
            sums: {},
            currentWeekLeader: "",
        }
        this.initializeForm = this.initializeForm.bind(this);
        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.fillBox = this.fillBox.bind(this);
        this.handleRollDice = this.handleRollDice.bind(this);
        this.handleToggleDice = this.handleToggleDice.bind(this);
        this.startRollAnimation = this.startRollAnimation.bind(this);
        this.getCurrentWeekLeader = this.getCurrentWeekLeader.bind(this);
    }

    setMounted(mounted) {
        this._isMounted = mounted;
        this.props.onGameMounted(mounted);
    }

    componentDidMount() {
        this.setMounted(true);
        let currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            FormService.initializeForm().then(
                response => {
                    var form = response.data;
                    console.log(form);
                    this.initializeForm(form);
                },
                error => {
                    // console.log(error);
                }
            );
        } else {
            this.initializeForm(null);
        }
        this.getCurrentWeekLeader();
    }

    componentWillUnmount() {
        this.setMounted(false);
    }

    initializeSums(form) {
        let sums = {};
        let sumLabels = ["numberSum", "diffSum", "labelSum"]
        for (let key in sumLabels) {
            sums[sumLabels[key]] = 0;
            for (let i in form.columns) {
                let column = form.columns[i];
                sums[column.columnType.label + "-" + sumLabels[key]] = 0;
            }
        }
        sums["finalSum"] = 0;
        return sums;
    }

    initializeForm(form) {
        if (this._isMounted) {
            if (form != null) {
                let announcementRequired = this.isAnnouncementRequired(form);
                let rollDisabled = form.rollCount === 3 || (announcementRequired && form.announcement == null);
                let diceDisabled = form.rollCount === 0 || form.rollCount === 3;
                let filledBoxCount = this.getFilledBoxCount(form);
                let sums = this.initializeSums(form);
                sums = this.updateSums(form, sums);
                this.setState({ form, sums, announcementRequired, rollDisabled, diceDisabled, filledBoxCount });
            } else {
                let form = {};
                form.columns = [];
                for (let i = 1; i <= 4; i++) {
                    let column = {};
                    column.columnType = {};
                    column.columnType.id = i;
                    column.columnType.label = i === 1 ? "DOWNWARDS" : i === 2 ? "UPWARDS" : i === 3 ? "ANY_DIRECTION" : "ANNOUNCEMENT";
                    column.boxes = [];
                    for (let j = 1; j <= 13; j++) {
                        let box = {};
                        box.boxType = {};
                        box.boxType.id = j;
                        box.boxType.label = j === 1 ? "ONES" : j === 2 ? "TWOS" : j === 3 ? "THREES" : j === 4 ? "FOURS" : j === 5 ? "FIVES" :
                            j === 6 ? "SIXES" : j === 7 ? "MAX" : j === 8 ? "MIN" : j === 9 ? "TRIPS" : j === 10 ? "STRAIGHT" :
                                j === 11 ? "FULL" : j === 12 ? "POKER" : "JAMB";
                        box.available = (box.boxType.label === "ONES" && column.columnType.label === "DOWNWARDS") ||
                            (box.boxType.label === "JAMB" && column.columnType.label === "UPWARDS") ||
                            column.columnType.label === "ANY_DIRECTION" || column.columnType.label === "ANNOUNCEMENT";
                        box.filled = false;
                        box.value = 0;
                        column.boxes.push(box);
                    }
                    form.columns.push(column);
                }
                form.dice = [];
                for (let i = 0; i <= 4; i++) {
                    let dice = {};
                    dice.ordinalNumber = i;
                    dice.value = 6;
                    dice.hold = false;
                    dice.disabled = true;
                    form.dice.push(dice)
                }
                form.announcement = null;
                form.rollCount = 0;
                form.id = null;
                let sums = this.initializeSums(form);
                let filledBoxCount = 0;
                this.setState({ form, sums, filledBoxCount });
            }
        }
    }

    handleRollDice() {
        let form = this.state.form
        if (form.id != null) {
            let diceToRoll = '{';
            for (let key in form.dice) {
                diceToRoll += '"' + form.dice[key].ordinalNumber + '" : "';
                diceToRoll += !form.dice[key].hold;
                diceToRoll += '",';
            }
            diceToRoll = diceToRoll.substring(0, diceToRoll.length - 1) + '}';
            FormService.rollDice(form.id, diceToRoll).then(
                response => {
                    let dice = response.data
                    this.updateDice(form, dice);

                },
                error => {
                    // console.log(error);
                }
            );
        } else {
            let dice = form.dice;
            for (let key in dice) {
                if (!dice[key].hold) {
                    dice[key].value = Math.round(1 + Math.random() * 5);
                }
            }
            this.updateDice(form, dice);
        }
    }

    updateDice(form, dice) {
        form.rollCount++;
        for (let key in form.dice) {
            if (!form.dice[key].hold) {
                form.dice[key].value = dice[key].value;
            }
        }
        let announcementRequired = this.isAnnouncementRequired(form);
        let rollDisabled = form.rollCount === 3 || (announcementRequired && form.announcement == null);
        let diceDisabled = form.rollCount === 0 || form.rollCount === 3;
        this.setState({ form, announcementRequired, rollDisabled, diceDisabled }, () => {
            this.startRollAnimation();
        });
    }

    isAnnouncementRequired(form) {
        let announcementRequired = true;
        for (let i in form.columns) {
            let column = form.columns[i];
            if (column.columnType.label !== "ANNOUNCEMENT") {
                for (let j in column.boxes) {
                    let box = column.boxes[j];
                    if (!box.filled) {
                        announcementRequired = false;
                        break;
                    }
                }
            }
        }
        return announcementRequired;
    }

    startRollAnimation() {
        let dice = this.state.form.dice;
        for (let key in dice) {
            if (!dice[key].hold) {
                (function (local_i) {
                    setTimeout(function () {
                        document.getElementById('dice' + local_i).classList.add('roll');
                    }, 0);
                    setTimeout(function () {
                        document.getElementById('dice' + local_i).classList.remove('roll');
                    }, 1000);
                })(key);
            }
        }
    }

    handleToggleDice(ordinalNumber) {
        let form = this.state.form;
        for (let key in form.dice) {
            if (form.dice[key].ordinalNumber === ordinalNumber) {
                form.dice[key].hold = !form.dice[key].hold;
                this.setState({ form });
                break;
            }
        }
    }

    handleBoxClick(columnType, boxType) {
        let announcement = this.state.form.announcement;
        let announced = false;
        if (columnType.label === "ANNOUNCEMENT") {
            if (announcement == null) {
                announced = true;
                this.announce(boxType.id);
            }
        }
        if (!announced) {
            this.fillBox(columnType, boxType);
        }
    }

    announce(boxTypeId) {
        let form = this.state.form;
        if (form.id != null) {
            FormService.announce(form.id, boxTypeId).then(
                response => {
                    form.announcement = response.data;
                    let boxesDisabled = true;
                    let rollDisabled = false;
                    this.setState({ form, boxesDisabled, rollDisabled });
                },
                error => {
                    // console.log(error);
                }
            );
        } else {
            form.announcement = boxTypeId;
            let boxesDisabled = true;
            let rollDisabled = false;
            this.setState({ form, boxesDisabled, rollDisabled });
        }
    }

    fillBox(columnType, boxType) {
        let form = this.state.form;
        if (form.id != null) {
            FormService.fillBox(form.id, columnType.id, boxType.id).then(
                response => {
                    let score = response.data;
                    this.fill(form, columnType, boxType, score);
                },
                error => {
                    // console.log(typeof error);
                    // console.log(error);
                }
            );
        } else {
            let dice = this.state.form.dice;
            let score = ScoreUtil.calculateScore(dice, boxType);
            this.fill(form, columnType, boxType, score);
        }
    }

    fill(form, columnType, boxType, score) {
        for (let i in form.columns) {
            let column = form.columns[i];
            if (column.columnType.id === columnType.id) {
                for (let j in column.boxes) {
                    let box = column.boxes[j];
                    if (box.boxType.id === boxType.id) {
                        box.value = score;
                        box.available = false;
                        box.filled = true;
                    }
                    if (columnType.label === "DOWNWARDS" && box.boxType.id === boxType.id + 1) {
                        box.available = true;
                    } else if (columnType.label === "UPWARDS" && box.boxType.id === boxType.id - 1) {
                        box.available = true;
                    }
                }
            }
        }
        for (let key in form.dice) {
            form.dice[key].hold = false;
        }
        form.rollCount = 0;
        form.announcement = null;
        let rollDisabled = false;
        let diceDisabled = true;
        let filledBoxCount = this.state.filledBoxCount + 1;
        let sums = this.state.sums;
        sums = this.updateSums(form, sums);
        this.setState({ form, sums, rollDisabled, diceDisabled, filledBoxCount }, () => {
            if (this.state.filledBoxCount === form.columns.length * form.columns[0].boxes.length) {
                setTimeout(
                    () => {
                        this.endGame();
                    }, 500
                );
            }
        });
        return form;
    }

    getFilledBoxCount() {
        let form = this.state.form;
        let filledBoxCount = 0;
        for (let i in form.columns) {
            let column = form.columns[i];
            for (let j in column.boxes) {
                let box = column.boxes[j];
                if (box.filled) filledBoxCount++;
            }
        }
        return filledBoxCount;
    }

    updateSums(form, sums) {
        for (let sum in sums) {
            sums[sum] = 0;
        }
        for (let i in form.columns) {
            let column = form.columns[i];
            for (let j in column.boxes) {
                let box = column.boxes[j];
                if (box.boxType.id <= 6 && box.filled) {
                    sums[column.columnType.label + "-numberSum"] += box.value;
                }
            }
            if (sums[column.columnType.label + "-numberSum"] >= NUMBERSUM_BONUS_THRESHOLD) sums[column.columnType.label + "-numberSum"] += NUMBERSUM_BONUS;

            sums["numberSum"] += sums[column.columnType.label + "-numberSum"]

            for (let j in column.boxes) {
                let box = column.boxes[j];
                if (box.boxType.id >= 9) sums[column.columnType.label + "-labelSum"] += box.value;
            }

            sums["labelSum"] += sums[column.columnType.label + "-labelSum"];

            let boxOnes, boxMax, boxMin;
            for (let j in column.boxes) {
                let box = column.boxes[j];
                if (box.boxType.label === "ONES") boxOnes = box;
                else if (box.boxType.label === "MAX") boxMax = box;
                else if (box.boxType.label === "MIN") boxMin = box;
            }
            if (boxOnes.filled && boxMax.filled && boxMin.filled) {
                sums[column.columnType.label + "-diffSum"] = boxOnes.value * (boxMax.value - boxMin.value);
            }

            sums["diffSum"] += sums[column.columnType.label + "-diffSum"];
        }
        sums["finalSum"] = sums["numberSum"] + sums["diffSum"] + sums["labelSum"];
        return sums;
    }

    render() {
        let currentUser = AuthService.getCurrentUser();
        let form = this.state.form;
        let rollCount = form.rollCount;
        let announcement = form.announcement;
        let diceDisabled = this.state.diceDisabled;
        let rollDisabled = this.state.rollDisabled;
        let boxesDisabled = this.state.boxesDisabled;
        let sums = this.state.sums;
        let gameInfo = { announcement, boxesDisabled, rollCount, sums };
        let currentWeekLeader = this.state.currentWeekLeader;
        return (
            <div className="center">
                {form.dice && <DiceRack rollDisabled={rollDisabled} rollCount={form.rollCount} dice={form.dice}
                    diceDisabled={diceDisabled} onToggleDice={this.handleToggleDice} />}
                {form.columns && <div className="form">
                    <div className="game-column">
                        <RulesButton />
                        <Label labelClass={"label label-image bg-white"} imgUrl={"../images/dice/1.bmp"} />
                        <Label labelClass={"label label-image bg-white"} imgUrl={"../images/dice/2.bmp"} />
                        <Label labelClass={"label label-image bg-white"} imgUrl={"../images/dice/3.bmp"} />
                        <Label labelClass={"label label-image bg-white"} imgUrl={"../images/dice/4.bmp"} />
                        <Label labelClass={"label label-image bg-white"} imgUrl={"../images/dice/5.bmp"} />
                        <Label labelClass={"label label-image bg-white"} imgUrl={"../images/dice/6.bmp"} />
                        <Label labelClass={"label sum bg-light-sky-blue"} value={"zbroj (1-6) + 30 ako >= 60"} />
                        <Label labelClass={"label bg-white"} value={"MAX"} />
                        <Label labelClass={"label bg-white"} value={"MIN"} />
                        <Label labelClass={"label sum bg-light-sky-blue"} value={"(max-min) x jedinice"} />
                        <Label labelClass={"label bg-white"} value={"TRIS"} />
                        <Label labelClass={"label bg-white"} value={"SKALA"} />
                        <Label labelClass={"label bg-white"} value={"FULL"} />
                        <Label labelClass={"label bg-white"} value={"POKER"} />
                        <Label labelClass={"label bg-white"} value={"JAMB"} />
                        <Label labelClass={"label sum bg-light-sky-blue"} value={"zbroj (tris‑jamb)"} /> {/* unicode hyphen! */}
                    </div>
                    <Column gameInfo={gameInfo} column={form.columns[0]} onBoxClick={this.handleBoxClick} />
                    <Column gameInfo={gameInfo} column={form.columns[1]} onBoxClick={this.handleBoxClick} />
                    <Column gameInfo={gameInfo} column={form.columns[2]} onBoxClick={this.handleBoxClick} />
                    <Column gameInfo={gameInfo} column={form.columns[3]} onBoxClick={this.handleBoxClick} />
                    <div className="game-column">
                        <RollDiceButton rollCount={form.rollCount} rollDisabled={rollDisabled} onRollDice={this.handleRollDice} />
                        <Label labelClass={"label number bg-light-sky-blue row-start-8"} number={gameInfo.sums["numberSum"]} id="numberSum" />
                        <RestartButton currentUser={currentUser} formId={form.id} />
                        <Label labelClass={"label number bg-light-sky-blue row-start-11"} number={gameInfo.sums["diffSum"]} id="diffSum" />
                        <Scoreboard />
                        <Label labelClass={"label number bg-light-sky-blue row-start-17"} number={gameInfo.sums["labelSum"]} id="labelSum" />
                    </div>
                    <div />
                    <div className="bottom-row">
                        {this.props.smallWindow ?
                            <MenuButton onToggleMenu={this.props.onToggleMenu} /> :
                            <a className="bg-light-pink form-button"
                                href="https://github.com/MatejDanic">Matej</a>}
                        <Label labelClass={"label leader"} value={currentWeekLeader ? "1. " + currentWeekLeader : ""} />
                        <Label labelClass={"label final bg-light-sky-blue"} number={gameInfo.sums["finalSum"]} id="labelSum" />

                    </div>
                </ div>}
            </div>
        )
    }

    endGame() {
        this.setState({ rollDisabled: true }, () => {
            alert("Čestitamo, vaš ukupni rezultat je " + this.state.sums[15]);
        })
    }

    getCurrentWeekLeader() {
        ScoreService.getCurrentWeekLeader().then(
            response => {
                if (this._isMounted) this.setState({ currentWeekLeader: response.data });
            },
            error => {
                // console.log(error);
            }
        );
    }
}
