import axios from 'axios';
const key = 'authToken';

export function expireAuthToken() {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

export function getLoggedInUser() {
  let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
  var endPoint = '/users/user';
  return axios
    .get(process.env.REACT_APP_SERVER_ADDR + endPoint, {
      headers: {
        'x-auth-token': authToken,
      },
    })
    .catch((err) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      return err;
    })
    .then((response) => {
      if (response) {
        let result = response.data;
        return result;
      }
    });
}

export function isLoggedIn() {
  let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
  if (!authToken) {
    return false;
  }
  var endPoint = '/users/isLoggedIn';
  return axios
    .get(process.env.REACT_APP_SERVER_ADDR + endPoint, {
      headers: {
        'x-auth-token': authToken,
      },
    })
    .catch((err) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      return false;
    })
    .then((response) => {
      return true;
    });
}

export function getAuthToken() {
  let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
  return authToken;
}

export function setAuthToken() {}
