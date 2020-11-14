import axios from 'axios';
require('dotenv').config();
const key = "authToken";

export function expireAuthToken() {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
}

export function getLoggedInUser() {
    let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    var endPoint = '/users/user';
    return axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint, {
        headers: {
            "x-auth-token": authToken
        }
    }).then(response => {
        if (response) {
            let result = response.data;
            return result;
        }
    }).catch(err => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
        return err;
    })
}

export function isLoggedIn() {
    let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if (!authToken) {
        return false
    }
    var endPoint = '/users/isLoggedIn';
    return axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint, {
        headers: {
            "x-auth-token": authToken
        }
    }).then(response => { return true }).catch(err => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
        return false
    });

}

export function getAuthToken() {
    let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    return authToken;
}

export function setAuthToken() {

}