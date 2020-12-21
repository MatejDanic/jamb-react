import axios from "axios";
import { authHeader } from "./auth.service";
import BASE_URL from "../constants/api-url";

const baseURL = BASE_URL + "/scores";

class ScoreService {
  
  getScores() {
    return axios.get(baseURL, { headers: authHeader() });
  }
  getScore(scoreId) {
    return axios.get(baseURL + "/" + scoreId, { headers: authHeader() });
  }
  deleteScore(scoreId) {
    return axios.delete(baseURL + "/" + scoreId, { headers: authHeader() });
  }
  getScoreboard() {
    return axios.get(baseURL + "/scoreboard", { headers: authHeader() });
  }
  getCurrentWeekLeader() {
    return axios.get(baseURL + "/leader", { headers: authHeader() });
  }
}

export default new ScoreService();
