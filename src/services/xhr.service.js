import { getToken } from "./auth.service";

export function request(method, url, body) {

    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json")
        if (getToken() != null) xhr.setRequestHeader("Authorization", "Bearer " + getToken());

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                if (method == "PATCH") console.log(xhr.response);
                resolve(xhr.response ? JSON.parse(xhr.response) : {});
            } else {
                reject(xhr.response ? JSON.parse(xhr.response) : {});
            }
        };
        xhr.onerror = function () {
            reject({ status: xhr.status, message: "Server trenutno nije dostupan. (Zovi Mateja)" });
        };
        xhr.send(body);
    });
}