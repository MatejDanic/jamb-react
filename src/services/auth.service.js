import axios from "axios";
import BASE_URL from "../constants/api-url";

const url = BASE_URL + "/auth";

class AuthService {

	login(loginRequest, callback) {
		let req = new XMLHttpRequest();
		req.onreadystatechange = function() { 
			if (req.readyState == 4) {
				callback(req.status, JSON.parse(req.response));
			}
		}
		req.open("POST", url + "/login", true);
		req.setRequestHeader("Content-Type", "application/json");
		let username = loginRequest.username;
		let password = loginRequest.password
		req.send(JSON.stringify({ username, password }));	
	}

	logout() {
		localStorage.removeItem("user");
	}

	register(registerRequest, callback) {
		let req = new XMLHttpRequest();
		req.onreadystatechange = function() { 
			if (req.readyState == 4) {
				callback(req.status, JSON.parse(req.response));
			}
		}
		req.open("POST", url + "/register", true);
		req.setRequestHeader("Content-Type", "application/json");
		let username = registerRequest.username;
		let password = registerRequest.password
		req.send(JSON.stringify({ username, password }));	
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