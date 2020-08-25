import axios from "axios";
import API_URL from "./api-url";

const apiURL = API_URL + "/auth";

class AuthService {
  login(username, password) {
    return axios
      .post(apiURL + "/login", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, password) {
    return axios.post(apiURL + "/register", {
      username,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
