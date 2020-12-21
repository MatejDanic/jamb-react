import axios from "axios";
import { authHeader } from "./auth.service";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/scores";

class ScoreService {
  
  getScores() {
    return axios.get(url, { headers: authHeader() });
  }
  getScore(scoreId) {
    return axios.get(url + "/" + scoreId, { headers: authHeader() });
  }
  deleteScore(scoreId) {
    return axios.delete(url + "/" + scoreId, { headers: authHeader() });
  }
  getScoreboard() {
    return axios.get(url + "/scoreboard", { headers: authHeader() });
  }
  getCurrentWeekLeader() {
    return axios.get(url + "/leader", { headers: authHeader() });
  }
}

export default new ScoreService();
