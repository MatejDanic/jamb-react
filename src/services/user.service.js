import axios from "axios";
import authHeader from "./auth-header";
import API_URL from "../misc/api-url";
import DateUtil from "../utils/date.util";

const apiURL = API_URL + "/users";

class UserService {
  getUsers() {
    return axios.get(apiURL, { headers: authHeader() })
  }
  getUser(userId) {
    return axios.get(apiURL + "/" + userId, { headers: authHeader() });
  }
  deleteUser(userId) {
    return axios.delete(apiURL + "/" + userId, { headers: authHeader() });
  }
  getLastScoreDate(scores) {
    let date = Date.UTC(2020, 1, 1, 0, 0);
    for (let key in scores) {
      let scoreDate = DateUtil.getDateFromLocalDateTime(scores[key].date);
      if (scoreDate > date) date = scoreDate;
    }
    return date;
  }
  getHighScore(scores) {
    let highScore = 0;
    for (let key in scores) {
      if (scores[key].value > highScore) highScore = scores[key].value;
    }
    return highScore;
  }
}

export default new UserService();
