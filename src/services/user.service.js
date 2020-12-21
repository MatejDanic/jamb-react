import axios from "axios";
import { authHeader } from "./auth.service";
import BASE_URL from "../constants/api-url";

const baseURL = BASE_URL + "/users";

class UserService {
  getUsers() {
    return axios.get(baseURL, { headers: authHeader() })
  }
  getUser(userId) {
    return axios.get(baseURL + "/" + userId, { headers: authHeader() });
  }
  deleteUser(userId) {
    return axios.delete(baseURL + "/" + userId, { headers: authHeader() });
  }
}

export default new UserService();
