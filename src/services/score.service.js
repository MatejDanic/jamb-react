import axios from "axios";
import authHeader from "./auth-header";
import API_URL from "./api-url";

const apiURL = API_URL + "/scores";

class ScoreService {
  getScores() {
    return axios.get(apiURL, { headers: authHeader() });
  }
  getScoreboard() {
    return axios.get(apiURL + "/scoreboard", { headers: authHeader() });
  }
  getCurrentWeekLeader() {
    return axios.get(apiURL + "/leader", { headers: authHeader() });
  }
}

export default new ScoreService();
