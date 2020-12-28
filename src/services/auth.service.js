import { request } from "./xhr.service";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/auth";

class AuthService {

    login(credentials) {
        return request("POST", url + "/login", credentials);
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(credentials) {
        return request("POST", url + "/register", credentials);
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));;
    }
}

export default new AuthService();

export function authHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
        return { Authorization: "Bearer " + user.accessToken };
    } else {
        return {};
    }
}

export function getToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
        return user.accessToken;
    } else {
        return  null;
    }
}