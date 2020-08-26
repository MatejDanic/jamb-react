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
}

export default new UserService();
