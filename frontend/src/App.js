import 'bootstrap';
import './css/theme.css';
import './css/survey.css';
import axios from 'axios';
import ReactGa from 'react-ga';
import Login from './views/Login';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { getLoggedInUser } from './helper/AuthHelper';
import "bootstrap-slider/dist/css/bootstrap-slider.min.css";

require('dotenv').config();

ReactGa.initialize(process.env.REACT_APP_GAID, { testMode: process.env.NODE_ENV === 'test' });

const StartSurveyHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'Clicked the Start Survey Button'
  })
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSubmissionIdx: 0,
      authToken: localStorage.getItem("authToken"),
      submissions: []
    };
  }

  componentDidMount() {

    ReactGa.pageview(window.location.pathname + window.location.search);

    getLoggedInUser().then(user => {
      if (user) {
        var endPoint = '/submissions/user/' + user._id;
        this.setState({ user: user });
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
          .then(res => {
            var submissions = res.data;
            this.setState(submissions);
          });
      }
    });
  }

  startSurvey() {
    // initialize and save new submission (blank)
    // append to state.submissions
    // set index to point to this submission

    // how to get projectName of the survey?
    // and if we get project name 

    let user = this.state.user;
    let submission = {};
    let dateTime = new Date();

    var endPoint = '/submissions/';
    axios.post(process.env.REACT_APP_SERVER_ADDR + endPoint, {
      userId: user?._id ?? null,
      projectName: "",
      date: dateTime,
      lifecycle: 6,
      submission: submission,
      completed: false
    })
      .then(res => {
        // update this.state.submissions object here
        let newSubmission = res.data;
        let submissions = this.state.submissions;
        submissions.push(newSubmission);
        this.setState({ submissions: submissions })
        this.setState({ currentSubmissionIdx: this.state.submissions.length - 1 });
        // push to survey route and pass new submission_is so progress can be saved
        this.props.history.push({ 
          pathname: '/DesignAssistantSurvey',
          state: {submission_id: res.data._id }
         })

      });
  }

  resumeSurvey(index) {

    // This is important because save relies on this index being updated
    this.setState({ currentSubmissionIdx: index });
    let submission = this.state.submissions[index];

    if (submission.completed) {
      // If survey is completed we need to pass submission repsonses and questions to results page
      // so we need to make a API call to get questions here
      var endPoint = '/questions';
      var json
      axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
        .then(res => {
          json = res.data;
          // replace double escaped characters so showdown correctly renders markdown frontslashes and newlines

          //TODO: Might be able ro remove this block of code when #177 (markdown render) is resolved
          var stringified = JSON.stringify(json);
          stringified = stringified.replace(/\\\\n/g, "\\n");
          stringified = stringified.replace(/\\\//g, "/");
          json = JSON.parse(stringified);
          //

          this.props.history.push({
            pathname: '/Results',
            state: { questions: json, responses: submission.submission }
          })
        })
    }
    else {
      // If survey is not completed, pass previous submissions so SruveyJS can load them into the model
      // so user can continue 
      this.props.history.push({
        pathname: '/DesignAssistantSurvey',
        state: { prevResponses: submission.submission, submission_id: submission._id }
      })
    }
  }

  render() {
    return (
      <div>
        <h1 className="section-header">Welcome</h1>
        <div style={{ padding: "1em" }}>
          <p>Welcome‌ ‌to‌ ‌the‌ ‌Responsible‌ ‌Design‌ ‌Assistant‌ ‌beta.‌ ‌This‌ ‌is‌ ‌a‌ ‌virtual‌ ‌guide‌ ‌to‌ ‌help‌ ‌those‌ designing,‌ ‌developing,‌ ‌and‌ ‌implementing‌ ‌AI‌ ‌systems‌ ‌do‌ ‌so‌ ‌in‌ ‌a‌ ‌responsible‌ ‌way.‌</p>
          <p>Committed‌ ‌to‌ ‌making‌ ‌responsible‌ ‌AI‌ ‌systems,‌ ‌we’ve‌ ‌done‌ ‌the‌ ‌hard‌ ‌work‌ ‌of‌ ‌deciphering‌ the‌ ‌best‌ ‌practices,‌ ‌policies,‌ ‌and‌ ‌principles‌ ‌and‌ ‌put‌ ‌them‌ ‌into‌ ‌a‌ ‌simple‌ ‌online‌ ‌survey.‌</p>
          <p>With‌ ‌our‌ ‌esteemed‌ ‌community‌ ‌of‌ ‌subject‌ ‌matter‌ ‌experts‌ ‌ranging‌ ‌from‌ ‌engineers,‌ ‌to‌ ethicists,‌ ‌to‌ ‌policy‌ ‌makers,‌ ‌we‌ ‌have‌ ‌taken‌ ‌the‌ ‌most‌ ‌cited‌ ‌principles,‌ ‌whitepapers,‌ ‌and‌ policy‌ ‌documents‌ ‌published‌ ‌by‌ ‌academics,‌ ‌standards‌ ‌organizations,‌ ‌and‌ ‌companies‌ and‌ ‌translated‌ ‌them‌ ‌into‌ ‌comprehensive‌ ‌questions.‌</p>
          <p>Based‌ ‌on‌ ‌our‌ ‌research‌ ‌and‌ ‌experience‌ ‌we‌ ‌have‌ ‌created‌ ‌a‌ ‌comprehensive‌ ‌evaluation‌ looking‌ ‌at‌ ‌the‌ ‌following‌ ‌dimensions‌ ‌of‌ ‌a‌ ‌trusted‌ ‌AI‌ ‌program:‌</p>
          <ol style={{ "fontWeight": "bold" }}>
            <li>Accountability</li>
            <li>Explainability and Interpretability</li>
            <li>Data Quality</li>
            <li>Bias and Fairness</li>
            <li>Robustness</li>
          </ol>
          <p>Our‌ ‌hope‌ ‌is‌ ‌that‌ ‌you‌ ‌will‌ ‌work‌ ‌with‌ ‌your‌ ‌colleagues‌ ‌who‌ ‌are‌ ‌responsible‌ ‌for‌ ‌different‌ aspects‌ ‌of‌ ‌your‌ ‌business‌ ‌to‌ ‌fill‌ ‌out‌ ‌the‌ ‌Design‌ ‌Assistant.‌ ‌Whether‌ ‌you‌ ‌are‌ ‌just‌ ‌thinking‌ about‌ ‌how‌ ‌to‌ ‌integrate‌ ‌AI‌ ‌tools‌ ‌into‌ ‌your‌ ‌business,‌ ‌or‌ ‌you‌ ‌have‌ ‌already‌ ‌deployed‌ several‌ ‌models,‌ ‌this‌ ‌tool‌ ‌is‌ ‌for‌ ‌you.‌ ‌We‌ ‌do‌ ‌think‌ ‌that‌ ‌these‌ ‌questions‌ ‌are‌ ‌best‌ ‌to‌ ‌think‌ about‌ ‌at‌ ‌the‌ ‌start‌ ‌of‌ ‌your‌ ‌project,‌ ‌however,‌ ‌we‌ ‌do‌ ‌think‌ ‌that‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌can‌ ‌be‌ used‌ ‌throughout‌ ‌the‌ ‌lifecycle‌ ‌of‌ ‌your‌ ‌project!‌</p>
          <p>To‌ ‌learn‌ ‌more‌ ‌about‌ ‌the‌ ‌background‌ ‌of‌ ‌this‌ ‌project,‌ ‌check‌ ‌out‌ ‌our‌ ‌post‌ ‌about‌ ‌the‌ creation‌ ‌of‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌on‌ <a target="_blank" rel="noopener noreferrer" href="https://ai-global.org/2020/04/28/creating-a-responsible-ai-trust-index-a-unified-assessment-to-assure-the-responsible-design-development-and-deployment-of-ai/">ai-global.org</a>‌‌</p>
          <p>For‌ ‌more‌ ‌information‌ ‌on‌ ‌how‌ ‌to‌ ‌use‌ ‌the‌ ‌Design‌ ‌Assistant,‌ ‌including‌ ‌FAQ’s,‌ ‌check‌ ‌out‌ our <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/presentation/d/1EDPhyRhIsiOrujLcHQv_fezXfgOz4Rl7a8lyOM_guoA/edit#slide=id.p1">Guide</a></p>
        </div>
        <div>
          <div className="card">
            <div className="card-header">Continue existing survey</div>
            <div className="card-body">
              <Table bordered responsive className="survey-results-table">
                <thead>
                  <tr>
                    <th>
                      Project Name
                      </th>
                    <th>
                      Last Updated
                      </th>
                    <th width="192px"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.submissions.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {value?.projectName ? value?.projectName : "No Project Name"}
                        </td>
                        <td>
                          {new Date(value.date).toLocaleString('en-US', { timeZone: Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ?? 'UTC' })}
                        </td>
                        <td width="175px" className="text-center">
                          {!value.completed &&
                            <Button block onClick={() => { this.resumeSurvey(index); StartSurveyHandler() }} >Resume Survey</Button>}
                          {value.completed &&
                            <Button id="ResultsButton" block onClick={() => { this.resumeSurvey(index); StartSurveyHandler() }} >Survey Results</Button>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <div className="float-right mr-3 mt-2">
          <Button onClick={() => this.startSurvey()}>Start New Survey</Button>
        </div>
        <Login />
      </div>
    );
  }
}

export default withRouter(App);