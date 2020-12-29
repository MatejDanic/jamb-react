import { request } from "./xhr.service";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/forms";

class FormService {
    
    initializeForm() {
        return request("PUT", url, null);
    }

    newForm() {
        return request("POST", url, null);
    }

    getForm(formId) {
        return request("Get", url + "/" + formId, null);
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
