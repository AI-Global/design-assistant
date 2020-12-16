import 'bootstrap';
import './css/theme.css';
import './css/survey.css';
import ReactGa from 'react-ga';
import Login from './views/Login';
import UserSubmissions from './views/UserSubmissions';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'nouislider/distribute/nouislider.min.css';

ReactGa.initialize(process.env.REACT_APP_GAID, {
  testMode: process.env.NODE_ENV != 'production',
});

class App extends Component {
  componentDidMount() {
    ReactGa.pageview(window.location.pathname + window.location.search);
  }

  render() {
    return (
      <div>
        <h1 className="section-header">Welcome</h1>
        <div style={{ padding: '1em' }}>
          <p>
            Welcome‌ ‌to‌ ‌the‌ ‌Responsible‌ ‌Design‌ ‌Assistant‌ ‌beta.‌
            ‌This‌ ‌is‌ ‌a‌ ‌virtual‌ ‌guide‌ ‌to‌ ‌help‌ ‌those‌ designing,‌
            ‌developing,‌ ‌and‌ ‌implementing‌ ‌AI‌ ‌systems‌ ‌do‌ ‌so‌ ‌in‌ ‌a‌
            ‌responsible‌ ‌way.‌
          </p>
          <p>
            Committed‌ ‌to‌ ‌making‌ ‌responsible‌ ‌AI‌ ‌systems,‌ ‌we’ve‌
            ‌done‌ ‌the‌ ‌hard‌ ‌work‌ ‌of‌ ‌deciphering‌ the‌ ‌best‌
            ‌practices,‌ ‌policies,‌ ‌and‌ ‌principles‌ ‌and‌ ‌put‌ ‌them‌
            ‌into‌ ‌a‌ ‌simple‌ ‌online‌ ‌survey.‌
          </p>
          <p>
            With‌ ‌our‌ ‌esteemed‌ ‌community‌ ‌of‌ ‌subject‌ ‌matter‌ ‌experts‌
            ‌ranging‌ ‌from‌ ‌engineers,‌ ‌to‌ ethicists,‌ ‌to‌ ‌policy‌
            ‌makers,‌ ‌we‌ ‌have‌ ‌taken‌ ‌the‌ ‌most‌ ‌cited‌ ‌principles,‌
            ‌whitepapers,‌ ‌and‌ policy‌ ‌documents‌ ‌published‌ ‌by‌
            ‌academics,‌ ‌standards‌ ‌organizations,‌ ‌and‌ ‌companies‌ and‌
            ‌translated‌ ‌them‌ ‌into‌ ‌comprehensive‌ ‌questions.‌
          </p>
          <p>
            Based‌ ‌on‌ ‌our‌ ‌research‌ ‌and‌ ‌experience‌ ‌we‌ ‌have‌
            ‌created‌ ‌a‌ ‌comprehensive‌ ‌evaluation‌ looking‌ ‌at‌ ‌the‌
            ‌following‌ ‌dimensions‌ ‌of‌ ‌a‌ ‌trusted‌ ‌AI‌ ‌program:‌
          </p>
          <ol style={{ fontWeight: 'bold' }}>
            <li>Accountability</li>
            <li>Explainability and Interpretability</li>
            <li>Data Quality</li>
            <li>Bias and Fairness</li>
            <li>Robustness</li>
          </ol>
          <p>
            Our‌ ‌hope‌ ‌is‌ ‌that‌ ‌you‌ ‌will‌ ‌work‌ ‌with‌ ‌your‌
            ‌colleagues‌ ‌who‌ ‌are‌ ‌responsible‌ ‌for‌ ‌different‌ aspects‌
            ‌of‌ ‌your‌ ‌business‌ ‌to‌ ‌fill‌ ‌out‌ ‌the‌ ‌Design‌ ‌Assistant.‌
            ‌Whether‌ ‌you‌ ‌are‌ ‌just‌ ‌thinking‌ about‌ ‌how‌ ‌to‌
            ‌integrate‌ ‌AI‌ ‌tools‌ ‌into‌ ‌your‌ ‌business,‌ ‌or‌ ‌you‌ ‌have‌
            ‌already‌ ‌deployed‌ several‌ ‌models,‌ ‌this‌ ‌tool‌ ‌is‌ ‌for‌
            ‌you.‌ ‌We‌ ‌do‌ ‌think‌ ‌that‌ ‌these‌ ‌questions‌ ‌are‌ ‌best‌
            ‌to‌ ‌think‌ about‌ ‌at‌ ‌the‌ ‌start‌ ‌of‌ ‌your‌ ‌project,‌
            ‌however,‌ ‌we‌ ‌do‌ ‌think‌ ‌that‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌can‌
            ‌be‌ used‌ ‌throughout‌ ‌the‌ ‌lifecycle‌ ‌of‌ ‌your‌ ‌project!‌
          </p>
          <p>
            To‌ ‌learn‌ ‌more‌ ‌about‌ ‌the‌ ‌background‌ ‌of‌ ‌this‌ ‌project,‌
            ‌check‌ ‌out‌ ‌our‌ ‌post‌ ‌about‌ ‌the‌ creation‌ ‌of‌ ‌the‌
            ‌Design‌ ‌Assistant‌ ‌on‌{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ai-global.org/2020/04/28/creating-a-responsible-ai-trust-index-a-unified-assessment-to-assure-the-responsible-design-development-and-deployment-of-ai/"
            >
              ai-global.org
            </a>
            ‌‌
          </p>
          <p>
            For‌ ‌more‌ ‌information‌ ‌on‌ ‌how‌ ‌to‌ ‌use‌ ‌the‌ ‌Design‌
            ‌Assistant,‌ ‌including‌ ‌FAQ’s,‌ ‌check‌ ‌out‌ our{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/presentation/d/1EDPhyRhIsiOrujLcHQv_fezXfgOz4Rl7a8lyOM_guoA/edit#slide=id.p1"
            >
              Guide
            </a>
          </p>
        </div>
        <Login />
        <UserSubmissions />
      </div>
    );
  }
}

export default withRouter(App);