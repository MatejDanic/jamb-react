import { request } from "./xhr.service";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/forms";

class FormService {
    
    initializeForm() {
        return request("PUT", url, null);
    }

    rollDice(formId, diceToRoll) {
        return request("PUT", url + "/" + formId + "/roll", diceToRoll);
    }

    announce(formId, boxType) {
        return request("PUT", url + "/" + formId + "/announce", boxType);
    }

    fillBox(formId, columnTypeId, boxTypeId) {
        return request("PUT", url + "/" + formId + "/columns/" + columnTypeId + "/boxes/" + boxTypeId + "/fill", null);
    }

    deleteForm(formId) {
        return request("DELETE", url + "/" + formId);
    }

    restartForm(formId) {
        return request("PUT", url + "/" + formId + "/restart", null);
    }
}

export default new FormService();
