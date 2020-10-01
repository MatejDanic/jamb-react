import axios from "axios";
import { authHeader } from "./auth.service";
import API_URL from "../constants/api-url";

const apiURL = API_URL + "/forms";

class FormService {
    
    initializeForm() {
        return axios.put(apiURL,
            null, { headers: authHeader() });
    }

    rollDice(formId, diceToRoll) {
        return axios.put(apiURL + "/" + formId + "/roll",
            diceToRoll, {
            headers: {
                "Content-Type": "Application/json",
                "Authorization": authHeader().Authorization
            }
        });
    }

    announce(formId, boxTypeId) {
        return axios.put(apiURL + "/" + formId + "/announce",
            boxTypeId, {
            headers: {
                "Content-Type": "Application/json",
                "Authorization": authHeader().Authorization
            }
        });
    }

    fillBox(formId, columnTypeId, boxTypeId) {
        return axios.put(apiURL + "/" + formId +
            "/columns/" + columnTypeId +
            "/boxes/" + boxTypeId + "/fill",
            null, { headers: authHeader() });
    }

    deleteForm(formId) {
        return axios.delete(apiURL + "/" + formId,
            { headers: authHeader() });
    }
}

export default new FormService();
