const axios = require('axios');
const PORTAL_API_BASE = 'https://portal.ai-global.org';

let get = async (apiToken, path, data) => {
  if (data) {
    path +=
      '?' +
      Object.entries(data)
        .map((kv) => kv.map(encodeURIComponent).join('='))
        .join('&');
  }
  return (
    await axios.get(PORTAL_API_BASE + path, {
      headers: {
        authorization: 'Bearer ' + apiToken,
      },
    })
  ).data;
};

module.exports = (apiToken) => {
  // TASK-TODO: add post, patch, delete, etc
  return {
    get: (url, data) => get(apiToken, url, data),
  };
};
