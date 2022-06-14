import 'bootstrap';
import './css/theme.css';
import './css/survey.css';
import ReactGa from 'react-ga';
import Login from './views/Login';
import { Container, Grid } from '@material-ui/core';
import UserSubmissions from './views/UserSubmissions';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { expireAuthToken } from './helper/AuthHelper';
import api from './api';

import 'nouislider/distribute/nouislider.min.css';
import { CenterFocusStrong } from '@material-ui/icons';

ReactGa.initialize(process.env.REACT_APP_GAID, {
  testMode: process.env.NODE_ENV != 'production',
});

const img = new Image();
const backgroundImage = (img.src = '../img/landing-background.png');





function Hero() {
  return (
    <Grid container direction="column" justifyContent='space-between'
      style={{
        height: '320px',
        backgroundSize: 'cover',
        backgroundImage: `url(${backgroundImage})`,
      }}>
      <Grid item>
        <Grid container direction="row" justifyContent='space-between' style={{ padding: '20px' }}>
          < Grid item >
            <a href="/">
              <img
                src="/img/responsible-rai-logo.png"
                alt="Responsible rai Logo"
                className="logo"
              />
            </a>
          </Grid >
          <Grid item>
            <Login />
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid item md />
        <Grid item md={8}>
          <h1>Responsible AI System Assessment</h1>
        </Grid>
        <Grid item md />
      </Grid>
    </Grid>
  );
}


let queryParamsFromProps = (props) => {
  let queryString = props.location.search;
  var query = {};
  var pairs = (queryString[0] === '?'
    ? queryString.substr(1)
    : queryString
  ).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
};

function HomePage(props) {
  let { code } = queryParamsFromProps(props);
  useEffect(() => {
    if (code) {
      let appName = 'designassistant-dev';
      if (window.location.origin == 'http://localhost:3000') {
        appName = 'localhost';
      }
      fetch('https://portal.ai-global.org/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
          client_id: appName,
          code_verifier: localStorage.getItem('codeVerifier'),
        }),
      })
        .then((resp) => resp.json())
        .then(({ accessToken }) => {
          api
            .post('users/auth', {
              accessToken: accessToken,
            })
            .then((response) => {
              const result = response.data;
              if (result.errors) {
                console.warn(result.errors);
              } else {
                expireAuthToken();
                localStorage.setItem('portalAccessToken', accessToken);
                localStorage.setItem('authToken', result['token']);
                window.location = '/';
              }
            })
            .catch((err) => {
              console.warn(err.response.data);
            });
        });
    }
  }, [code]);
  return (
    <Container maxWidth="lg">
      <Hero />
      <UserSubmissions mb={5} />
    </Container>
  );
}

export default withRouter(HomePage);
