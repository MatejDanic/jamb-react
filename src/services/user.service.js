import axios from "axios";
import authHeader from "./auth-header";
import API_URL from "./api-url";

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
      let scoreDate = Date.UTC(scores[key].date[0], scores[key].date[1], scores[key].date[2], scores[key].date[3], scores[key].date[4]);
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
