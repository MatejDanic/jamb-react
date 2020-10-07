import React, { Component } from "react";
import "./button.css";
import "../../../constants/colors.css";

export default class RulesButton extends Component {

  render() {
    return (
      <button className="button rules bg-light-pink" onClick={() => this.handleClick()} style={{ backgroundImage: 'url(../images/misc/info.png)' }}></button>
    )
  }

  handleClick() {
    alert("Bacanjem kockica postižu se odredeni rezultati koji se upisuju u obrazac. Na kraju igre postignuti se rezultati zbrajaju.\n" +
      "Nakon prvog bacanja, igrac gleda u obrazac i odlucuje hoce li nešto odmah upisati ili ce igrati dalje.\n" +
      "U jednom potezu igrac može kockice (sve ili samo one koje izabere) bacati tri puta\n" +
      "Prvi stupac obrasca upisuje se odozgo prema dolje, a drugom obrnuto. U treci stupac rezultati se upisuju bez odredenog redosljeda.\n" +
      "Cetvrti stupac mora se popunjavati tako da se nakon prvog bacanja najavljuje igra za odredeni rezultat.\n" +
      "Igrac je obavezan u to polje upisati ostvareni rezultat bez obzira da li mu to nakon tri bacanja odgovara ili ne.\n" +
      "Rezultat se može, ali ne mora upisati u cetvrti stupac nakon prvog bacanja.");
  }
}
