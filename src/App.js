import 'bootstrap';
import './css/theme.css';
import './css/survey.css';
import ReactGa from 'react-ga';
import Login from './views/Login';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import UserSubmissions from './views/UserSubmissions';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { expireAuthToken } from './helper/AuthHelper';
import api from './api';
import 'nouislider/distribute/nouislider.min.css';

ReactGa.initialize(process.env.REACT_APP_GAID, {
  testMode: process.env.NODE_ENV != 'production',
});

const img = new Image();
const backgroundImage = (img.src = '../img/landing-background.png');

const LandingButton = withStyles(() => ({
  root: {
    borderRadius: '8px',
    border: '1px solid',
    backgroundColor: '#FFFFFF',
    borderColor: '#386EDA',
    color: '#386EDA',
    '&:hover': {
      backgroundColor: '#386EDA',
      borderColor: '#386EDA',
      color: '#FFFFFF',
    },
  },
}))(Button);

function WelcomeText() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        width: '99.6vw',
        height: '52vh',
        position: 'relative',
        left: '50%',
        right: '50%',
        top: '-100px',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div
        style={{
          padding: '10em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>RAI Certification: Fair landing</h1>
        <Box mt={2} />
        <div
          style={{
            width: '55%',
          }}
        >
          Welcome‌ ‌to‌ ‌the‌ ‌RAIL Certification Beta.‌ ‌This‌ ‌is‌ ‌a‌
          ‌virtual‌ ‌guide‌ ‌to‌ ‌help‌ ‌those‌ designing,‌ ‌developing,‌ ‌and‌
          ‌implementing‌ ‌AI‌ ‌systems‌ ‌do‌ ‌so‌ ‌in‌ ‌a‌ ‌responsible‌
          ‌way.‌Committed‌ ‌to‌ ‌making‌ ‌responsible‌ ‌AI‌ ‌systems,‌ ‌we’ve‌
          ‌done‌ ‌the‌ ‌hard‌ ‌work‌ ‌of‌ ‌deciphering‌ the‌ ‌best‌ ‌practices,‌
          ‌policies,‌ ‌and‌ ‌principles‌ ‌and‌ ‌put‌ ‌them‌ ‌into‌ ‌a‌ ‌simple‌
          ‌online‌ ‌survey.‌
        </div>
      </div>
    </div>
  );
}

function LandingDescription() {
  return (
    <div>
      <p>
        With‌ ‌our‌ ‌esteemed‌ ‌community‌ ‌of‌ ‌subject‌ ‌matter‌ ‌experts‌
        ‌ranging‌ ‌from‌ ‌engineers,‌ ‌to‌ ethicists,‌ ‌to‌ ‌policy‌ ‌makers,‌
        ‌we‌ ‌have‌ ‌taken‌ ‌the‌ ‌most‌ ‌cited‌ ‌principles,‌ ‌whitepapers,‌
        ‌and‌ policy‌ ‌documents‌ ‌published‌ ‌by‌ ‌academics,‌ ‌standards‌
        ‌organizations,‌ ‌and‌ ‌companies‌ and‌ ‌translated‌ ‌them‌ ‌into‌
        ‌comprehensive‌ ‌questions.‌
      </p>
      <p>
        Based‌ ‌on‌ ‌our‌ ‌research‌ ‌and‌ ‌experience‌ ‌we‌ ‌have‌ ‌created‌
        ‌a‌ ‌comprehensive‌ ‌evaluation‌ looking‌ ‌at‌ ‌the‌ ‌following‌
        ‌dimensions‌ ‌of‌ ‌a‌ ‌trusted‌ ‌AI‌ ‌program:‌
      </p>
      <ol style={{ marginBottom: '30px' }}>
        <li>Organization Maturity</li>
        <li>Accountability</li>
        <li>Data</li>
        <li>Fairness</li>
        <li>Interpretability</li>
        <li>Robustness</li>
      </ol>
      <p>
        Our‌ ‌hope‌ ‌is‌ ‌that‌ ‌you‌ ‌will‌ ‌work‌ ‌with‌ ‌your‌ ‌colleagues‌
        ‌who‌ ‌are‌ ‌responsible‌ ‌for‌ ‌different‌ aspects‌ ‌of‌ ‌your‌
        ‌business‌ ‌to‌ ‌fill‌ ‌out‌ ‌the‌ ‌Design‌ ‌Assistant.‌ ‌Whether‌ ‌you‌
        ‌are‌ ‌just‌ ‌thinking‌ about‌ ‌how‌ ‌to‌ ‌integrate‌ ‌AI‌ ‌tools‌
        ‌into‌ ‌your‌ ‌business,‌ ‌or‌ ‌you‌ ‌have‌ ‌already‌ ‌deployed‌
        several‌ ‌models,‌ ‌this‌ ‌tool‌ ‌is‌ ‌for‌ ‌you.‌ ‌We‌ ‌do‌ ‌think‌
        ‌that‌ ‌these‌ ‌questions‌ ‌are‌ ‌best‌ ‌to‌ ‌think‌ about‌ ‌at‌ ‌the‌
        ‌start‌ ‌of‌ ‌your‌ ‌project,‌ ‌however,‌ ‌we‌ ‌do‌ ‌think‌ ‌that‌ ‌the‌
        ‌Design‌ ‌Assistant‌ ‌can‌ ‌be‌ used‌ ‌throughout‌ ‌the‌ ‌lifecycle‌
        ‌of‌ ‌your‌ ‌project!‌
      </p>
    </div>
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
    <div>
      <WelcomeText />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <LandingButton variant="outlined" type="button">
          START NEW SURVEY
        </LandingButton>
        <LandingButton variant="outlined" type="button">
          FREQUENTLY ASKED QUESTIONS
        </LandingButton>
        <LandingButton variant="outlined" type="button">
          GUIDE LINK
        </LandingButton>
      </div>
      <div class="divider"></div>
      <Box mt={5} />
      <Login />
      <UserSubmissions />
      <Box mt={5} />
      <LandingDescription />
    </div>
  );
}

export default withRouter(HomePage);
