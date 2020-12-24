import React, { Component } from "react";
import "./button.css";
import "../../../constants/colors.css";

export default class RulesButton extends Component {

  render() {
    return (
      <button className="form-button rules bg-lightpink" onClick={() => this.handleClick()} style={{ backgroundImage: 'url(../images/misc/info.png)' }}></button>
    )
  }

  handleClick() {
    alert("Bacanjem kockica postižu se određeni rezultati koji se upisuju u obrazac. Na kraju igre postignuti se rezultati zbrajaju.\n" +
      "Nakon prvog bacanja, igrač gleda u obrazac i odlučuje hoće li nešto odmah upisati ili će igrati dalje.\n" +
      "U jednom potezu igrač može kockice (sve ili samo one koje izabere) bacati tri puta\n" +
      "Prvi stupac obrasca upisuje se odozgo prema dolje, a drugi obrnuto. U treći stupac rezultati se upisuju bez određenog redoslijeda.\n" +
      "Četvrti stupac mora se popunjavati tako da se nakon prvog bacanja najavljuje igra za određeni rezultat.\n" +
      "Igrač je obavezan u to polje upisati ostvareni rezultat bez obzira da li mu to nakon tri bacanja odgovara ili ne.\n" +
      "Rezultat se može, ali ne mora upisati u četvrti stupac nakon prvog bacanja.\n\n" + 
      "BONUSI:\n" + 
      "- BROJEVI (Ako je ukupan zbroj u stupcu od 1 do 6 veći ili jednak 60) +30\n" + 
      "- TRIS (3 jednake kockice) +10\n" + 
      "- SKALA (1, 2, 3, 4, 5) 35\n" + 
      "- SKALA (2, 3, 4, 5, 6) 45\n" + 
      "- FULL (2 + 3 jednake kockice) +30\n" + 
      "- POKER (4 jednake kockice) +40\n" + 
      "- JAMB (5 jednakih kockica) +50\n");
  }
}
