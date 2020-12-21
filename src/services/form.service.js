import axios from "axios";
import { authHeader } from "./auth.service";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/forms";

class FormService {
    
    initializeForm() {
        return axios.put(url,
            null, { headers: authHeader() });
    }

    rollDice(formId, dice) {
        let diceToRoll = '{';
        for (let key in dice) {
            diceToRoll += '"' + dice[key].ordinalNumber + '" : "';
            diceToRoll += !dice[key].hold;
            diceToRoll += '",';
        }
        diceToRoll = diceToRoll.substring(0, diceToRoll.length - 1) + '}';
        return axios.put(url + "/" + formId + "/roll",
            diceToRoll, {
            headers: {
                "Content-Type": "Application/json",
                "Authorization": authHeader().Authorization
            }
        });
    }

    announce(formId, boxTypeId) {
        return axios.put(url + "/" + formId + "/announce",
            boxTypeId, {
            headers: {
                "Content-Type": "Application/json",
                "Authorization": authHeader().Authorization
            }
        });
    }

    fillBox(formId, columnTypeId, boxTypeId) {
        return axios.put(url + "/" + formId +
            "/columns/" + columnTypeId +
            "/boxes/" + boxTypeId + "/fill", null, 
            { headers: authHeader() });
    }

    deleteForm(formId) {
        return axios.delete(url + "/" + formId,
            { headers: authHeader() });
    }

    restartForm(formId) {
        return axios.put(url + "/" + formId + "/restart", null, 
            { headers: authHeader() });
    }
}

export default new FormService();
