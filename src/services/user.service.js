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
    const dateFormat = new Intl.DateTimeFormat('UK', { year: 'numeric', month: '2-digit', day: '2-digit' });
    let date = dateFormat.format(new Date("2000-01-01"));
    for (let key in scores) {
      let scoreDate = dateFormat.format(new Date(scores[key].date.toString()));
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
