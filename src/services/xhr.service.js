import { getToken } from "./auth.service";

export function request(method, url, body) {

    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        
        xhr.setRequestHeader("Content-Type", "application/json");
        if (getToken() != null) xhr.setRequestHeader("Authorization", "Bearer " + getToken());

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response ? JSON.parse(xhr.response) : {});
            } else {
                reject(xhr.response ? JSON.parse(xhr.response) : {});
            }
        };

        xhr.onerror = function () {
            reject({ status: this.status, message: xhr.statusText });
        };

        xhr.send(body);
    });
}