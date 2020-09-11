import axios from "axios";
import { authHeader } from "./auth.service";
import API_URL from "../misc/api-url";

const apiURL = API_URL + "/scores";

class ScoreService {
  
  getScores() {
    return axios.get(apiURL, { headers: authHeader() });
  }
  getScore(scoreId) {
    return axios.get(apiURL + "/" + scoreId, { headers: authHeader() });
  }
  deleteScore(scoreId) {
    return axios.delete(apiURL + "/" + scoreId, { headers: authHeader() });
  }
  getScoreboard() {
    return axios.get(apiURL + "/scoreboard", { headers: authHeader() });
  }
  getCurrentWeekLeader() {
    return axios.get(apiURL + "/leader", { headers: authHeader() });
  }
}

export default new ScoreService();
