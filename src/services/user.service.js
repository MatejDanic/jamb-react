import { request } from "./xhr.service";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/users";

class UserService {

    getUsers() {
        return request("GET", url, null);
    }

    getUser(userId) {
        return request("GET", url + "/" + userId, null);
    }

    deleteUser(userId) {
        return request("DELETE", url + "/" + userId, null);
    }
}

export default new UserService();
