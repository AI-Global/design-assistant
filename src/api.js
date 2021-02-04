import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || window.location.origin;

export default {
  get: (path, options = {}) => axios.get(BASE_URL + '/api/' + path, options),
  delete: (path, options = {}) =>
    axios.delete(BASE_URL + '/api/' + path, options),
  put: (path, data, options = {}) =>
    axios.put(BASE_URL + '/api/' + path, data, options),
  post: (path, data, options = {}) =>
    axios.post(BASE_URL + '/api/' + path, data, options),
};
