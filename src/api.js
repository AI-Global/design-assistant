import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || window.location.origin;

export default {
  get: (path) => axios.get(BASE_URL + '/api/' + path),
  put: (path, data) => axios.get(BASE_URL + '/api/' + path, data),
  post: (path, data) => axios.post(BASE_URL + '/api/' + path, data),
};
