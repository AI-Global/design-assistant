import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

import { getLoggedInUser, expireAuthToken } from '../helper/AuthHelper';
import UserSettings from './UserSettings';
import crypto from 'crypto';

let genRandomCode = () => {
  let text = '';
  let chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  for (var i = 0; i < 30; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
};

let sha256 = (message) => {
  return crypto.createHash('sha256').update(message).digest('base64');
};

export default function Login() {
  let [user, setUser] = useState(null);
  let createAccount = () => {
    window.location = 'https://portal.ai-global.org/register';
  };
  let login = async () => {
    // See portal oauth.routes.js
    let redirect = 'https://designassistant.dev.ai-global.org';
    let appName = 'designassistant-dev';
    if (window.location.origin.includes('https://rai-certification')) {
      let redirect = window.location.origin;
    }
    if (window.location.origin == 'http://localhost:3000') {
      redirect = 'http://localhost:3000';
      appName = 'localhost';
    }
    let codeVerifier = genRandomCode();
    localStorage.setItem('codeVerifier', codeVerifier);
    let codeChallenge = await sha256(codeVerifier);
    let oauthParams = {
      response_type: 'code',
      client_id: appName,
      redirect_uri: redirect,
      scope: '*',
      state: 'verystatey',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    };
    let oauthURL = `https://portal.ai-global.org/auth?${Object.keys(oauthParams)
      .map((k) => k + '=' + oauthParams[k])
      .join('&')}`;
    window.location = oauthURL;
  };
  useEffect(() => {
    getLoggedInUser().then(setUser);
  }, []);
  if (!user) {
    return (
      <div style={{ position: 'absolute', top: '20px', right: '150px' }}>
        <Button onClick={login}>Login</Button>
        <Button style={{ marginLeft: '10px' }} onClick={createAccount}>
          Create Account
        </Button>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', top: '20px', right: '150px' }}>
      <p className="msg">
        Logged in as: <strong>{user.username}</strong> &nbsp;
      </p>
      <UserSettings />
    </div>
  );
}
