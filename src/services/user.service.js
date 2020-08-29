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
  getLastScoreDate(scores, dateFormat) {
    let date = dateFormat.format(Date.UTC(2020, 1, 1, 0, 0));
    for (let key in scores) {
      let scoreDate = dateFormat.format(Date.UTC(scores[key].date[0], scores[key].date[1], scores[key].date[2], scores[key].date[3], scores[key].date[4]));
      if (scoreDate > date) date = scoreDate;
    }
    return date.toString();
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
