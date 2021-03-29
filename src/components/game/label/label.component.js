import React, { Component } from "react";
// components
import Popup from "../../popup/popup.component";
// styles
import "../../../constants/colors.css";
import "./label.css";

export default class Label extends Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            showPopup: false
        }
        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup() {
        if (!this.props.labelClass.includes("number")) {
            let messages = [];
            let display = this.props.number == null ? this.props.value : this.props.number;
            messages.push(this.getInfoMessage(display, this.props.imgUrl));
            this.setState({ showPopup: !this.state.showPopup, messages });
        }
    }

    render() {
        let messages = this.state.messages;
        let display = this.props.number == null ? this.props.value : this.props.number;
        return (
            <div onClick={this.togglePopup} className={this.props.labelClass} style={{ backgroundImage: 'url(' + this.props.imgUrl + ')' }}>
                {display}
                {this.state.showPopup && <Popup text={messages} onOk={this.togglePopup} />}
            </div>
        )
    }

    getInfoMessage(display, imgUrl) {
        let message = "";
        if (imgUrl) {
            if (imgUrl.includes("DOWNWARDS")) {
                message = "DOLJE: Ovaj red se popunjava od vrha prema dnu";
            } else if (imgUrl.includes("UPWARDS")) {
                message = "GORE: Ovaj red se popunjava od dna prema vrhu";
            } else if (imgUrl.includes("ANY_DIRECTION")) {
                message = "GORE-DOLJE: Ovaj red se popunjava bilo kojim redosljedom";
            } else if (imgUrl.includes("ANNOUNCEMENT")) {
                message = "NAJAVA: Za popuniti ovaj red, potrebno je nakon prvog bacanja najaviti rezultat";
            } else if (imgUrl.includes("1")) {
                message = "JEDINICE: Zbroj svih kockica sa vrijednosti 1";
            } else if (imgUrl.includes("2")) {
                message = "DVICE: Zbroj svih kockica sa vrijednosti 2";
            } else if (imgUrl.includes("3")) {
                message = "TRICE: Zbroj svih kockica sa vrijednosti 3";
            } else if (imgUrl.includes("4")) {
                message = "ČETVRTICE: Zbroj svih kockica sa vrijednosti 4";
            } else if (imgUrl.includes("5")) {
                message = "PETICE: Zbroj svih kockica sa vrijednosti 5";
            } else if (imgUrl.includes("6")) {
                message = "ŠESTICE: Zbroj svih kockica sa vrijednosti 6";
            }
        } else {
            if (display.includes("MAX")) {
                message = "MAX: Zbroj vrijednosti svih kockica";
            } else if (display.includes("MIN")) {
                message = "MIN: Zbroj vrijednosti svih kockica";
            } else if (display.includes("TRIS")) {
                message = "TRIS: 3 Kockice s istom vrijednosti + 10";
            } else if (display.includes("SKALA")) {
                message = "SKALA: mala (1, 2, 3, 4, 5) -> 35 ili velika (2, 3, 4, 5, 6) -> 45";
            } else if (display.includes("FULL")) {
                message = "FULL: 2 i 3 kockice s istim vrijednostima + 30";
            } else if (display.includes("POKER")) {
                message = "POKER: 4 kockice s istom vrijednosti + 40";
            } else if (display.includes("JAMB")) {
                message = "JAMB: 5 kockica s istom vrijednosti + 50";
            } else if (display.includes("(1-6)")) {
                message = "JEDINICE + DVICE + TRICE + ČETVRTICE + PETICE + ŠESTICE, ako je jednak ili veći od 60, dodaje se 30";
            } else if (display.includes("max-min")) {
                message = "Razlika između MAX i MIN pomnožena s brojem jedinica";
            } else if (display.includes("(tris")) {
                message = "TRIS + SKALA + FULL + POKER + JAMB";
            } else {
                message = display;
            }
        }
        return message;
    }
}
