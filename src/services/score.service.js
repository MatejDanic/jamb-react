import { request } from "./xhr.service";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/scores";

class ScoreService {

    getScores() {
        return request("GET", url, null);
    }

    getScore(scoreId) {
        return request("GET", url + "/" + scoreId, null);
    }

    deleteScore(scoreId) {
        return request("DELETE", url + "/" + scoreId, null);
    }

    getScoreboard() {
        return request("GET", url + "/scoreboard", null);
    }
    
    getCurrentWeekLeader() {
        return request("GET", url + "/leader", null);
    }
}

export default new ScoreService();
