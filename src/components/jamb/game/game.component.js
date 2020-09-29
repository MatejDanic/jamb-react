
import React, { Component } from "react";
import AuthService from "../../../services/auth.service";
import ScoreService from "../../../services/score.service";
import FormService from "../../../services/form.service";
import Label from "../label/label.component";
import DiceRack from "../dice/dice-rack.component";
import ScoreUtil from "../../../utils/score.util";
import RollDiceButton from "../button/roll-dice-button.component";
import RulesButton from "../button/rules-button.component";
import RestartButton from "../button/restart-button.component";
import MenuButton from "../button/menu-button.component";
import Scoreboard from "../scoreboard/scoreboard.component";
import "./game.css";
import Column from "../column/column.component";

export default class Game extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            currentUser: undefined,
            currentWeekLeader: "",
            formId: null,
            boxesLeft: 52,
            annoucement: null,
            announcementRequired: false,
            rollsLeft: 3,
            rollDisabled: false,
            diceDisabled: true,
            boxesDisabled: true,
            sums: [],
            form: {},
        }
        this.rollDice = this.rollDice.bind(this);
        this.toggleDice = this.toggleDice.bind(this);
        this.boxClick = this.boxClick.bind(this);
        this.fillBox = this.fillBox.bind(this);
        this.initializeForm = this.initializeForm.bind(this);
        this.startRollAnimation = this.startRollAnimation.bind(this);
        this.getCurrentWeekLeader = this.getCurrentWeekLeader.bind(this);
    }

    setMounted(mounted) {
        this._isMounted = mounted;
        this.props.onGameMounted(mounted);
    }

    componentDidMount() {
        this.setMounted(true);
        this.setState({ currentUser: AuthService.getCurrentUser() }, () => {
            if (this.state.currentUser) {
                FormService.initializeForm().then(
                    response => {
                        var form = response.data;
                        // console.log(form);
                        this.initializeForm(form);
                    },
                    error => {
                        console.log(error);
                    }
                );
            } else {
                this.initializeForm(null);
            }
        });
        this.getCurrentWeekLeader();
    }

    componentWillUnmount() {
        this.setMounted(false);
    }

    initializeForm(form) {
        if (this._isMounted) {
            if (form != null){
                let diceDisabled = form.rollCount === 0 || form.rollCount === 3;
                let boxesDisabled = form.rollCount === 0;
                let announcementRequired = this.isAnnouncementRequired(form);
                let rollDisabled = form.rollCount === 3 || (announcementRequired && form.announcement == null);
                this.setState({ form, diceDisabled, boxesDisabled, announcementRequired, rollDisabled }, () => {
                    this.updateSums();
                });
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
                        box.available = (i === 1 && j === 1) || (i === 2 && j === 13) || i >= 2
                        box.filled = false;
                        box.value = 0;
                        column.boxes.push(box);
                    }
                    form.columns.push(column);
                }
                form.dice = [];
                for (let i = 1; i <= 5; i++) {
                    let dice = {};
                    dice.ordinalNumber = i;
                    dice.value = 6;
                    dice.hold = false;
                    form.dice.push(dice)
                }
                form.announcement = null;
                form.rollCount = 0;
                form.id = null;
                console.log(form);
                console.log(form.columns[0]);

                let sums = [];
                for (let i = 0; i < 16; i ++) {
                    sums.push(0);
                }
                this.setState({ form, sums });
            }
        }
    }

    rollDice() {
        if (this.state.currentUser) {
            let diceToRoll = '{';
            for (let key in this.state.form.dice) {
                diceToRoll += '"' + this.state.form.dice[key].ordinalNumber + '" : "';
                diceToRoll += !this.state.form.dice[key].hold;
                diceToRoll += '",';
            }
            diceToRoll = diceToRoll.substring(0, diceToRoll.length - 1) + '}';
            FormService.rollDice(this.state.form.id, diceToRoll).then(
                response => {
                    let dice = response.data
                    let form = this.state.form;
                    for (let key in form.dice) {
                        if (!form.dice[key].hold) {
                            form.dice[key].value = dice[key].value;
                        }
                    }
                    this.setState({ form }, () => {
                        this.startRollAnimation();
                    });
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            let form = this.state.form;
            for (let key in form.dice) {
                if (!form.dice[key].hold) {
                    form.dice[key].value = Math.round(1 + Math.random() * 5);
                }
            }
            this.setState({ form }, () => {
                this.startRollAnimation();
            });
        }
        let announcementRequired = this.isAnnouncementRequired()
        this.setState({ rollsLeft: this.state.rollsLeft - 1, rollDisabled: (this.state.rollsLeft === 1 || announcementRequired),
                         diceDisabled: (this.state.rollsLeft === 1), boxesDisabled: false });
    }

    isAnnouncementRequired() {
        let announcementRequired = this.state.announcement == null;
        for (let column in this.state.form.columns) {
            for (let box in this.state.form.columns[column].boxes) {
                if (!box.filled) {
                    announcementRequired = false;
                    break;
                }
            }
        }
        return announcementRequired;
    }

    startRollAnimation() {
        for (let key in this.state.form.dice) {
            if (!this.state.form.dice[key].hold) {
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

    toggleDice(ordinalNumber) {
        let form = this.state.form;
        for (let key in form.dice) {
            if (form.dice[key].ordinalNumber === ordinalNumber) {
                form.dice[key].hold = !form.dice[key].hold;
                this.setState({ form });
                break;
            } 
        }
    }

    boxClick(columnTypeId, boxTypeId) {
        let announced = false;
        if (columnTypeId === 4) {
            if (this.state.announcement == null) {
                announced = true;
                this.announce(boxTypeId);
            }
        }
        if (!announced) {
            this.fillBox(columnTypeId, boxTypeId);
        }
    }

    announce(boxTypeId) {
        if (this.state.currentUser) {
            FormService.announce(this.state.formId, boxTypeId).then(
                response => {
                    this.setState({ boxesDisabled: true, announcement: response.data, rollDisabled: false });
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.setState({ boxesDisabled: true, announcement: boxTypeId, rollDisabled: false });
        }
    }

    fillBox(columnTypeId, boxTypeId) {
        if (this.state.currentUser) {
            FormService.fillBox(this.state.formId, columnTypeId, boxTypeId).then(
                response => {
                    let value = response.data;
                    let form = this.state.form;
                    for (let column in form.columns) {
                        if (column.columnType.id === columnTypeId) {
                            for (let box in column.boxes) {
                                if (box.boxType.id === boxTypeId) {
                                    box.value = value;
                                    box.available = false;
                                    box.filled = true;
                                }
                                if (columnTypeId === 1 && boxTypeId <= 12 && box.boxType.id === boxTypeId + 1) {
                                    box.available = true;
                                } else if (columnTypeId === 2 && boxTypeId >= 1 && box.boxType.id === boxTypeId - 1) {
                                    box.available = true;
                                }
                            }
                        }
                    }
                    this.setState({ form }, () => {
                        this.updateSums();
                    });
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            let score = ScoreUtil.checkScore(this.state.form.dice, boxTypeId);
            let form = this.state.form;
            for (let column in form.columns) {
                if (column.columnType.id === columnTypeId) {
                    for (let box in column.boxes) {
                        if (box.boxType.id === boxTypeId) {
                            box.value = score;
                            box.available = false;
                            box.filled = true;
                        }
                        if (columnTypeId === 1 && boxTypeId <= 12 && box.boxType.id === boxTypeId + 1) {
                            box.available = true;
                        } else if (columnTypeId === 2 && boxTypeId >= 1 && box.boxType.id === boxTypeId - 1) {
                            box.available = true;
                        }
                    }
                }
            }
            this.setState({ form }, () => {
                this.updateSums();
            });
        }
        let form = this.state.form;
        for (let key in form.dice) {
            form.dice[key].hold = false;
        }
        this.setState({ form }, () => {
            this.updateSums();
        })
        this.setState({rollsLeft: 3, rollDisabled: false, diceDisabled: true,boxesDisabled: true, 
                        boxesLeft: this.state.boxesLeft - 1, announcement: null }, () => {
            if (this.state.boxesLeft === 0) {
                setTimeout(
                    () => {
                        this.endGame();
                    }, 500
                );
            }
        });
    }

    updateSums() {
        let form = this.state.form;
        let sums = this.state.sums;
        for (let column in form.columns) {
            for (let sum in sums) {
                sums[sum] = 0;
            }
            for (let box in column.boxes) {
                if (box.boxType.id <= 6) sums[column.columnType.id-1] += box.value;
            }
            if (sums[column.columnType.id-1] >= 60) sums[column.columnType.id-1] += 30;
                
            sums[4] += sums[column.columnType.id-1]
            
            for (let box in column.boxes) {
                if (box.boxType.id >= 9) sums[column.columnType.id-1 + 10] += box.value;
            }

            sums[14] += sums[column.columnType.id-1 + 10];

            let diffReady = true;
            for (let box in column.boxes) {
                if ((box.boxType.id === 1 && !box.filled) || (box.boxType.id === 7 && !box.filled) || (box.boxType.id === 8 && !box.filled)) {
                    diffReady = false;
                }
            }
            if (diffReady) {
                sums[column.columnType.id-1 + 5] = column.boxes[0] * (column.boxes[6].value - column.boxes[7].value);
            }

            sums[9] += sums[column.columnType.id-1 + 5];
        }
        sums[15] = sums[4] + sums[9] + sums[14];
        this.setState({ sums });
    }

    render() {
        let form = this.state.form;
        let sums = this.state.sums;
        let gameInfo = [this.state.announcement, this.state.boxesDisabled, this.state.rollsLeft];
        return (
            <div className="game">
                {form.dice && <DiceRack rollDisabled={this.state.rollDisabled} rollsLeft={this.state.rollsLeft} dice={form.dice}
                                        diceDisabled={this.state.diceDisabled} onToggleDice={this.toggleDice} />}
                {form.columns && <div className="form">
                    <div className="label-column">
                        <RulesButton />
                        <Label labelClass={"label label-image"} imgUrl={"../images/dice/1.bmp"} />
                        <Label labelClass={"label label-image"} imgUrl={"../images/dice/2.bmp"} />        
                        <Label labelClass={"label label-image"} imgUrl={"../images/dice/3.bmp"} />
                        <Label labelClass={"label label-image"} imgUrl={"../images/dice/4.bmp"} />
                        <Label labelClass={"label label-image"} imgUrl={"../images/dice/5.bmp"} />
                        <Label labelClass={"label label-image"} imgUrl={"../images/dice/6.bmp"} />
                        <Label labelClass={"label sum bg-light-sky-blue"} value={"zbroj (1-6) + 30 ako >= 60"} />         
                        <Label labelClass={"label"} value={"MAX"} />
                        <Label labelClass={"label"} value={"MIN"} />
                        <Label labelClass={"label sum bg-light-sky-blue"} value={"(max-min) x jedinice"} />
                        <Label labelClass={"label"} value={"TRIS"} />     
                        <Label labelClass={"label"} value={"SKALA"} />
                        <Label labelClass={"label"} value={"FULL"} />
                        <Label labelClass={"label"} value={"POKER"} />
                        <Label labelClass={"label"} value={"JAMB"} />
                        <Label labelClass={"label sum bg-light-sky-blue"} value={"zbroj (tris‑jamb)"} /> {/* unicode hyphen! */}
                    </div>
                    <Column variables={form.columns[0]}/>
                    <Column variables={form.columns[1]}/>
                    <Column variables={form.columns[2]}/>
                    <Column variables={form.columns[3]}/>
                    <div className="labels-column">
                        <RollDiceButton rollsLeft={this.state.rollsLeft} disabled={this.state.rollDisabled} onRollDice={this.rollDice} />
                        <Label labelClass={"label number bg-light-sky-blue"} number={sums[4]} id="numberSum" />
                        <RestartButton currentUser={this.state.currentUser} formId={this.state.formId} />
                        <Label labelClass={"label number bg-light-sky-blue"} number={sums[9]} id="diffSum" />
                        <Scoreboard />
                        <Label labelClass={"label number bg-light-sky-blue"} number={sums[14]} id="labelSum" />
                    </div>
                    <div />

                    {this.props.smallWindow ? 
                        <MenuButton onToggleMenu={this.props.onToggleMenu}/> : 
                        <a className="bg-light-pink form-button" 
                            href="https://github.com/MatejDanic">Matej</a>}
                    {/* <Label labelClass={"label label-image"} imgUrl={"../images/field/downwards.bmp"} />
                    <Label labelClass={"label label-image"} imgUrl={"../images/field/upwards.bmp"} />
                    <Label labelClass={"label label-image"} imgUrl={"../images/field/any_direction.bmp"} />
                    <Label labelClass={"label"} value={"NAJAVA"} />
                    
                    
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[0]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[0]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[0]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[0]} onBoxClick={this.boxClick} />
                    
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[1]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[1]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[1]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[1]} onBoxClick={this.boxClick} />
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[2]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[2]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[2]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[2]} onBoxClick={this.boxClick} />
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[3]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[3]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[3]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[3]} onBoxClick={this.boxClick} />
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[4]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[4]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[4]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[4]} onBoxClick={this.boxClick} />
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[5]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[5]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[5]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[5]} onBoxClick={this.boxClick} />
                    
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[0]} id="DOWNWARDS-numberSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[1]} id="UPWARDS-numberSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[2]} id="ANY_DIRECTION-numberSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[3]} id="ANNOUNCEMENT-numberSum" />
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[6]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[6]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[6]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[6]} onBoxClick={this.boxClick} />


                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[7]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[7]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[7]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[7]} onBoxClick={this.boxClick} />
                    
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[5]} id="DOWNWARDS-diffSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[6]} id="UPWARDS-diffSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[7]} id="ANY_DIRECTION-diffSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[8]} id="ANNOUNCEMENT-diffSum" />
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[8]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[8]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[8]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[8]} onBoxClick={this.boxClick} />

                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[9]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[9]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[9]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[9]} onBoxClick={this.boxClick} />
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[10]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[10]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[10]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[10]} onBoxClick={this.boxClick} />
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[11]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[11]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[11]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[11]} onBoxClick={this.boxClick} />
                    
                    <Box gameInfo={gameInfo} variables={form.columns[0].boxes[12]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[1].boxes[12]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[2].boxes[12]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={form.columns[3].boxes[12]} onBoxClick={this.boxClick} />
                    
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[10]} id="DOWNWARDS-labelSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[11]} id="UPWARDS-labelSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[12]} id="ANY_DIRECTION-labelSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[13]} id="ANNOUNCEMENT-labelSum" />
                    
                    
                    <Label labelClass={"label leader"} value={"1. " + this.state.currentWeekLeader} />
                    <Label labelClass={"label final bg-light-sky-blue"} number={sums[15]} id="labelSum" /> */}
                </div>}
                
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
                console.log(error);
            }
        );
    }
}
