import axios from "axios";
import { authHeader } from "./auth.service";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/users";

class UserService {
  getUsers() {
    return axios.get(url, { headers: authHeader() })
  }
  getUser(userId) {
    return axios.get(url + "/" + userId, { headers: authHeader() });
  }
  deleteUser(userId) {
    return axios.delete(url + "/" + userId, { headers: authHeader() });
  }
}

export default new UserService();
