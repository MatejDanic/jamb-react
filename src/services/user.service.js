import { request } from "./xhr.service";
import API_URL from "../constants/api-url";

const url = API_URL + "/users";

class UserService {

    getUsers() {
        return request("GET", url, null);
    }

    getUserForm(userId) {
        return request("GET", url + "/" + userId + "/form", null);
    }

    getUser(userId) {
        return request("GET", url + "/" + userId, null);
    }

    deleteUser(userId) {
        return request("DELETE", url + "/" + userId, null);
    }

    getUserPreference(userId) {
        return request("GET", url + "/" + userId + "/preferences", null);
    }

    updateUserPreference(userId, preference) {
        return request("PATCH", url + "/" + userId + "/preferences", preference);
    }
}

export default new UserService();
