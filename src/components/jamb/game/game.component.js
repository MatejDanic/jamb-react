
import React, { Component } from "react";
import AuthService from "../../../services/auth.service";
import ScoreService from "../../../services/score.service";
import FormService from "../../../services/form.service";
import Box from "../box/box.component";
import Label from "../label/label.component";
import DiceRack from "../dice/dice-rack.component";
import ScoreUtil from "../../../utils/score.util";
import RollDiceButton from "../button/roll-dice-button.component";
import RulesButton from "../button/rules-button.component";
import RestartButton from "../button/restart-button.component";
import MenuButton from "../button/menu-button.component";
import Scoreboard from "../scoreboard/scoreboard.component";
import "./game.css";

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
            sums: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            dice: [
                { value: 6, hold: false, ordinalNumber: 0 },
                { value: 6, hold: false, ordinalNumber: 1 },
                { value: 6, hold: false, ordinalNumber: 2 },
                { value: 6, hold: false, ordinalNumber: 3 },
                { value: 6, hold: false, ordinalNumber: 4 }
            ],
            boxes: [
                { available: true, value: 0, filled: false, label: 0 },
                { available: false, value: 0, filled: false, label: 1 },
                { available: false, value: 0, filled: false, label: 2 },
                { available: false, value: 0, filled: false, label: 3 },
                { available: false, value: 0, filled: false, label: 4 },
                { available: false, value: 0, filled: false, label: 5 },
                { available: false, value: 0, filled: false, label: 6 },
                { available: false, value: 0, filled: false, label: 7 },
                { available: false, value: 0, filled: false, label: 8 },
                { available: false, value: 0, filled: false, label: 9 },
                { available: false, value: 0, filled: false, label: 10 },
                { available: false, value: 0, filled: false, label: 11 },
                { available: false, value: 0, filled: false, label: 12 },
                { available: false, value: 0, filled: false, label: 13 },
                { available: false, value: 0, filled: false, label: 14 },
                { available: false, value: 0, filled: false, label: 15 },
                { available: false, value: 0, filled: false, label: 16 },
                { available: false, value: 0, filled: false, label: 17 },
                { available: false, value: 0, filled: false, label: 18 },
                { available: false, value: 0, filled: false, label: 19 },
                { available: false, value: 0, filled: false, label: 20 },
                { available: false, value: 0, filled: false, label: 21 },
                { available: false, value: 0, filled: false, label: 22 },
                { available: false, value: 0, filled: false, label: 23 },
                { available: false, value: 0, filled: false, label: 24 },
                { available: true, value: 0, filled: false, label: 25 },
                { available: true, value: 0, filled: false, label: 26 },
                { available: true, value: 0, filled: false, label: 27 },
                { available: true, value: 0, filled: false, label: 28 },
                { available: true, value: 0, filled: false, label: 29 },
                { available: true, value: 0, filled: false, label: 30 },
                { available: true, value: 0, filled: false, label: 31 },
                { available: true, value: 0, filled: false, label: 32 },
                { available: true, value: 0, filled: false, label: 33 },
                { available: true, value: 0, filled: false, label: 34 },
                { available: true, value: 0, filled: false, label: 35 },
                { available: true, value: 0, filled: false, label: 36 },
                { available: true, value: 0, filled: false, label: 37 },
                { available: true, value: 0, filled: false, label: 38 },
                { available: true, value: 0, filled: false, label: 39 },
                { available: true, value: 0, filled: false, label: 40 },
                { available: true, value: 0, filled: false, label: 41 },
                { available: true, value: 0, filled: false, label: 42 },
                { available: true, value: 0, filled: false, label: 43 },
                { available: true, value: 0, filled: false, label: 44 },
                { available: true, value: 0, filled: false, label: 45 },
                { available: true, value: 0, filled: false, label: 46 },
                { available: true, value: 0, filled: false, label: 47 },
                { available: true, value: 0, filled: false, label: 48 },
                { available: true, value: 0, filled: false, label: 49 },
                { available: true, value: 0, filled: false, label: 50 },
                { available: true, value: 0, filled: false, label: 51 }
            ]
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
            }
        });
        this.getCurrentWeekLeader();
    }

    componentWillUnmount() {
        this.setMounted(false);
    }

    initializeForm(form) {
        if (this._isMounted) {
            this.setState(state => {
                state.boxesLeft = 52;
                for (var column = 0; column < 4; column++) {
                    for (var box = 0; box < 13; box++) {
                        state.boxes[column * 13 + box].value = form.columns[column].boxes[box].value;
                        state.boxes[column * 13 + box].filled = form.columns[column].boxes[box].filled;
                        if (form.columns[column].boxes[box].filled) state.boxesLeft--;
                        state.boxes[column * 13 + box].available = form.columns[column].boxes[box].available;
                    }
                }
                for (var i = 0; i < form.dice.length; i++) {
                    state.dice[i].value = form.dice[i].value;
                }
            });
            var announcementRequired
            this.setState({}, () => {
                announcementRequired = this.isAnnouncementRequired();
            })
            this.setState({
                formId: form.id,
                announcement: form.announcement != null ? 39 + form.announcement : null,
                rollsLeft: 3 - form.rollCount,
                diceDisabled: form.rollCount === 0 || form.rollCount === 3,
                boxesDisabled: form.rollCount === 0,
                announcementRequired: announcementRequired,
                rollDisabled: form.rollCount === 3 || (announcementRequired && form.announcement == null)
            }, () => {
                this.updateSums();
            });
        }
    }

    rollDice() {
        if (this.state.currentUser) {
            var diceToRoll = '{';
            for (var i = 0; i < this.state.dice.length; i++) {
                diceToRoll += '"' + this.state.dice[i].ordinalNumber + '" : "';
                diceToRoll += !this.state.dice[i].hold;
                diceToRoll += '",';
            }
            diceToRoll = diceToRoll.substring(0, diceToRoll.length - 1) + '}';
            FormService.rollDice(this.state.formId, diceToRoll).then(
                response => {
                    let dice = response.data
                    this.setState(state => {
                        for (var i = 0; i < state.dice.length; i++) {
                            if (!this.state.dice[i].hold) {
                                state.dice[i].value = dice[i].value;
                            }
                        }
                    });
                    this.setState({}, () => {
                        this.startRollAnimation();
                    });
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.setState(state => {
                for (var i = 0; i < state.dice.length; i++) {
                    if (!state.dice[i].hold) {
                        state.dice[i].value = Math.round(1 + Math.random() * 5);
                    }
                }
            });
            this.setState({}, () => {
                this.startRollAnimation();
            });
        }
        var announcementRequired = this.isAnnouncementRequired()
        this.setState({ rollsLeft: this.state.rollsLeft - 1, rollDisabled: (this.state.rollsLeft === 1 || announcementRequired), diceDisabled: (this.state.rollsLeft === 1), boxesDisabled: false });
    }

    isAnnouncementRequired() {
        var announcementRequired = this.state.announcement == null;
        for (var column = 0; column < 3; column++) {
            for (var box = 0; box < 13; box++) {
                if (!this.state.boxes[column * 13 + box].filled) {
                    announcementRequired = false;
                    break;
                }
            }
        }
        return announcementRequired;
    }

    startRollAnimation() {
        for (var i = 0; i < this.state.dice.length; i++) {
            if (!this.state.dice[i].hold) {
                (function (local_i) {
                    setTimeout(function () {
                        document.getElementById('dice' + local_i).classList.add('roll');
                    }, 0);
                    setTimeout(function () {
                        document.getElementById('dice' + local_i).classList.remove('roll');
                    }, 1000);
                })(i);
            }
        }
    }

    toggleDice(label) {
        this.setState(state => {
            state.dice[label].hold = !state.dice[label].hold;
        });
        this.setState({});
    }

    boxClick(label) {
        var announced = false;
        if (label >= 39) {
            if (this.state.announcement == null) {
                announced = true;
                this.announce(label);
            }
        }
        if (!announced) {
            this.fillBox(label);
        }
    }

    announce(index) {
        if (this.state.currentUser) {
            FormService.announce(this.state.formId, index % 13).then(
                response => {
                    this.setState({ boxesDisabled: true, announcement: response.data + 13 * 3, rollDisabled: false });
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.setState({ boxesDisabled: true, announcement: index, rollDisabled: false });
        }
    }

    fillBox(index) {
        if (this.state.currentUser) {
            FormService.fillBox(this.state.formId, parseInt(index / 13, 10), index % 13).then(
                response => {
                    let value = response.data;
                    this.setState(state => {
                        state.boxes[index].value = value;
                        state.boxes[index].available = false;
                        state.boxes[index].filled = true;
                        if (index <= 11) {
                            state.boxes[index + 1].available = true;
                        } else if (index >= 14 && index <= 25) {
                            state.boxes[index - 1].available = true;
                        }
                    });
                    this.setState({}, () => {
                        this.updateSums();
                    });
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            var score = ScoreUtil.checkScore(index % 13, this.state.dice);
            this.setState(state => {
                state.boxes[index].value = score;
                state.boxes[index].available = false;
                state.boxes[index].filled = true;
                if (index <= 11) {
                    state.boxes[index + 1].available = true;
                } else if (index >= 14 && index <= 25) {
                    state.boxes[index - 1].available = true;
                }
            });
            this.setState({}, () => {
                this.updateSums();
            });
        }
        this.setState({
            rollsLeft: 3, rollDisabled: false, diceDisabled: true,
            boxesDisabled: true, boxesLeft: this.state.boxesLeft - 1, announcement: null
        },
            () => {
                if (this.state.boxesLeft === 0) {
                    setTimeout(
                        () => {
                            this.endGame();
                        }, 500
                    );
                }
            });
        this.setState(state => {
            for (var i = 0; i < state.dice.length; i++) {
                state.dice[i].hold = false;
            }
        });
    }

    updateSums() {
        var column, i;
        this.setState(state => {
            for (column = 0; column < 4; column++) {
                state.sums[column] = 0;
                for (i = 0; i < 6; i++) {
                    state.sums[column] += state.boxes[column * 13 + i].value;
                }
                if (state.sums[column] >= 60) state.sums[column] += 30;
                state.sums[4] = 0;
                for (i = 0; i < 4; i++) {
                    state.sums[4] += state.sums[i]
                }
                state.sums[column + 10] = 0;
                for (i = 8; i < 13; i++) {
                    state.sums[column + 10] += state.boxes[column * 13 + i].value;
                }
                state.sums[14] = 0;
                for (i = 0; i < 4; i++) {
                    state.sums[14] += state.sums[10 + i]
                }
                if (state.boxes[column * 13].filled && state.boxes[column * 13 + 6].filled && state.boxes[column * 13 + 7].filled) {
                    state.sums[column + 5] = state.boxes[column * 13].value * (state.boxes[column * 13 + 6].value - state.boxes[column * 13 + 7].value);
                    state.sums[9] = 0;
                    for (i = 0; i < 4; i++) {
                        state.sums[9] += state.sums[5 + i]
                    }
                }
            }
            state.sums[15] = state.sums[4] + state.sums[9] + state.sums[14];
        });
        this.setState({});
    }

    render() {
        let sums = this.state.sums;
        let boxes = this.state.boxes;
        let gameInfo = [this.state.announcement, this.state.boxesDisabled, this.state.rollsLeft];
        return (
            <div className="game">
                <DiceRack rollDisabled={this.state.rollDisabled} rollsLeft={this.state.rollsLeft} diceDisabled={this.state.diceDisabled} dice={this.state.dice}
                    onToggleDice={this.toggleDice} />
                <div className="form">
                    <RulesButton />
                    <Label labelClass={"label label-image"} imgUrl={"../images/field/downwards.bmp"} />
                    <Label labelClass={"label label-image"} imgUrl={"../images/field/upwards.bmp"} />
                    <Label labelClass={"label label-image"} imgUrl={"../images/field/any_direction.bmp"} />
                    <Label labelClass={"label"} value={"NAJAVA"} />
                    <RollDiceButton rollsLeft={this.state.rollsLeft} disabled={this.state.rollDisabled} onRollDice={this.rollDice} />
                    {/* <button className="show-button scoreboard" onClick={() => this.showScoreboard()}>Lj e s t v i c a</button> */}
                    {/* <div /> */}
                    <Label labelClass={"label label-image"} imgUrl={"../images/dice/1.bmp"} />
                    <Box gameInfo={gameInfo} variables={boxes[0]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[13]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[26]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[39]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label label-image"} imgUrl={"../images/dice/2.bmp"} />
                    <Box gameInfo={gameInfo} variables={boxes[1]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[14]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[27]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[40]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label label-image"} imgUrl={"../images/dice/3.bmp"} />
                    <Box gameInfo={gameInfo} variables={boxes[2]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[15]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[28]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[41]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label label-image"} imgUrl={"../images/dice/4.bmp"} />
                    <Box gameInfo={gameInfo} variables={boxes[3]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[16]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[29]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[42]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label label-image"} imgUrl={"../images/dice/5.bmp"} />
                    <Box gameInfo={gameInfo} variables={boxes[4]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[17]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[30]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[43]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label label-image"} imgUrl={"../images/dice/6.bmp"} />
                    <Box gameInfo={gameInfo} variables={boxes[5]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[18]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[31]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[44]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label sum bg-light-sky-blue"} value={"zbroj (1-6) + 30 ako >= 60"} />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[0]} id="DOWNWARDS-numberSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[1]} id="UPWARDS-numberSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[2]} id="ANY_DIRECTION-numberSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[3]} id="ANNOUNCEMENT-numberSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[4]} id="numberSum" />
                    <Label labelClass={"label"} value={"MAX"} />
                    <Box gameInfo={gameInfo} variables={boxes[6]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[19]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[32]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[45]} onBoxClick={this.boxClick} />
                    {/* <button className={"show-button restart"} style={{ backgroundImage: 'url(../images/misc/restart.png)' }} onClick={() => { if (window.confirm('Jeste li sigurni da želite početi ispočetka?')) this.restart() }} /> */}
                    <RestartButton currentUser={this.state.currentUser} formId={this.state.formId} />
                    {/* <div /> */}
                    <Label labelClass={"label"} value={"MIN"} />
                    <Box gameInfo={gameInfo} variables={boxes[7]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[20]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[33]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[46]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label sum bg-light-sky-blue"} value={"(max-min) x jedinice"} />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[5]} id="DOWNWARDS-diffSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[6]} id="UPWARDS-diffSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[7]} id="ANY_DIRECTION-diffSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[8]} id="ANNOUNCEMENT-diffSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[9]} id="diffSum" />
                    <Label labelClass={"label"} value={"TRIS"} />
                    <Box gameInfo={gameInfo} variables={boxes[8]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[21]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[34]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[47]} onBoxClick={this.boxClick} />
                    {/* <button className="show-button scoreboard" onClick={() => this.showScoreboard()}>Lj e s t v i c a</button> */}
                    <Scoreboard />
                    {/* <button className="show-button rules" onClick={() => this.showRules()}>P r a v i l a</button> */}
                    {/* <div /> */}
                    <Label labelClass={"label"} value={"SKALA"} />
                    <Box gameInfo={gameInfo} variables={boxes[9]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[22]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[35]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[48]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label"} value={"FULL"} />
                    <Box gameInfo={gameInfo} variables={boxes[10]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[23]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[36]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[49]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label"} value={"POKER"} />
                    <Box gameInfo={gameInfo} variables={boxes[11]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[24]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[37]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[50]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label"} value={"JAMB"} />
                    <Box gameInfo={gameInfo} variables={boxes[12]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[25]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[38]} onBoxClick={this.boxClick} />
                    <Box gameInfo={gameInfo} variables={boxes[51]} onBoxClick={this.boxClick} />
                    {/* <div /> */}
                    <Label labelClass={"label sum bg-light-sky-blue"} value={"zbroj (tris‑jamb)"} /> {/* unicode hyphen! */}
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[10]} id="DOWNWARDS-labelSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[11]} id="UPWARDS-labelSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[12]} id="ANY_DIRECTION-labelSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[13]} id="ANNOUNCEMENT-labelSum" />
                    <Label labelClass={"label number bg-light-sky-blue"} number={sums[14]} id="labelSum" />
                    {/* <button className="show-button rules" onClick={() => this.showRules()}>Pravila</button> */}
                    {this.props.smallWindow ? <MenuButton onToggleMenu={this.props.onToggleMenu}/> : 
                    <a className="menu-button-replacement bg-light-pink form-button" 
                        href="https://github.com/MatejDanic">Matej</a>}
                    <Label labelClass={"label leader"} value={"1. " + this.state.currentWeekLeader} />
                    {/* <RollDiceButton rollsLeft={this.state.rollsLeft} disabled={this.state.rollDisabled} onRollDice={this.rollDice} /> */}
                    {/* <button className="show-button rules" onClick={showRules}>Pravila</button>
                    <button className="show-button scoreboard" onClick={showScoreboard}>Ljestvica</button> */}
                    <Label labelClass={"label final bg-light-sky-blue"} number={sums[15]} id="labelSum" />
                </div>
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
