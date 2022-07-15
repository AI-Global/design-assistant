import api from '../api';
const key = 'authToken';

export function expireAuthToken() {
  console.log('expireAuthToken');
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

export function getLoggedInUser() {
  let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
  return api
    .get('users/user', {
      headers: {
        'x-auth-token': authToken,
      },
    })
    .catch((err) => {
      // localStorage.removeItem(key);
      // sessionStorage.removeItem(key);
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
  return api
    .get('users/isLoggedIn', {
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

export function setAuthToken() { }
