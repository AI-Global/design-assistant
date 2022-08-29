import React, { Component } from 'react';
import { getLoggedInUser } from '../helper/AuthHelper';
import { Button, Box, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AssessmentGrid from '../Components/AssessmentGrid';
import Assessment from '../Components/Assessment';

import api from '../api';
import ReactGa from 'react-ga';
import { withRouter } from 'react-router-dom';

const LandingButton = withStyles(() => ({
  root: {
    borderRadius: '8px',
    border: '1px solid',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    borderColor: '#386EDA',
    color: '#386EDA',
    '&:hover': {
      backgroundColor: '#386EDA',
      borderColor: '#386EDA',
      color: '#FFFFFF',
    },
  },
}))(Button);

const StartSurveyHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'Clicked the Start Survey Button',
  });
};

const guidancePath =
  'https://drive.google.com/file/d/18SnZxv5tSHcGhLfqaEIafD1WFYKLnE9g/view';
class UserSubmissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSubmissionIdx: 0,
      authToken: localStorage.getItem('authToken'),
      submissions: [],
      showDeleteWarning: false,
      isLoggedIn: false,
      showSignupModal: false,
    };
  }

  componentDidMount() {
    this.state.isLoggedIn = true;
    // get the logged in user and their submissions from backend
    getLoggedInUser().then((user) => {
      if (user) {
        this.setState({ user: user });
        this.setState({ collabRole: user.collabRole });
        api
          .get('submissions/' + this.state.collabRole)

          .then((res) => {
            var submissions = res?.data;
            if (submissions) {
              this.setState(submissions);
            }
          });
      }
    });
  }

  startSurvey() {
    this.props.history.push({
      pathname: '/SystemAssessment',
      state: { user_id: this.state?.user?._id },
    });
  }

  resumeSurvey(index) {
    // This is important because save relies on this index being updated
    this.setState({ currentSubmissionIdx: index });
    let submission = this.state.submissions[index];

    if (submission.completed) {
      // If survey is completed we need to pass submission repsonses and questions to results page
      // so we need to make a API call to get questions here
      var json;
      api.get('questions').then((res) => {
        json = res.data;
        // replace double escaped characters so showdown correctly renders markdown frontslashes and newlines

        //TODO: Might be able ro remove this block of code when #177 (markdown render) is resolved
        var stringified = JSON.stringify(json);
        stringified = stringified.replace(/\\\\n/g, '\\n');
        stringified = stringified.replace(/\\\//g, '/');
        json = JSON.parse(stringified);
        //
        console.log('Pushing questions to results state: ', json)
        this.props.history.push({
          pathname: '/Results',
          state: { questions: json, responses: submission.submission ?? {} },
        });
      });
    } else {
      // If survey is not completed, pass previous submissions so SruveyJS can load them into the model
      // so user can continue
      this.props.history.push({
        pathname: '/SystemAssessment',
        state: {
          prevResponses: submission.submission,
          submission_id: submission._id,
          filters: {
            roles: submission.roles,
            domain: submission.domain,
            region: submission.region,
            lifecycle: submission.lifecycle,
          },
          userType: submission.system.length > 0,
          system: submission.system,
          region: submission.regionData,
          domain: submission.domainData
        },
      });
    }
  }

  showDeleteWarning(index) {
    this.setState({ currentSubmissionIdx: index });
    this.setState({ showDeleteWarning: true });
  }

  handleSignupShow = () => this.setState({ showSignupModal: true });

  deleteSurvey(index) {
    this.setState({ currentSubmissionIdx: index });
    let currentSubmissionIdx = this.state.currentSubmissionIdx;
    let submissions = this.state.submissions;
    let submission = submissions[currentSubmissionIdx];
    api.delete('submissions/delete/' + submission._id).then((response) => {
      submissions.splice(currentSubmissionIdx, 1);
      this.setState({ submissions: submissions });
    });
    this.setState({ showDeleteWarning: false });
  }

  // clone an existing survey into a new one
  cloneSurvey(index) {
    let submission = this.state.submissions[index];
    let user = this.state.user;
    let dateTime = new Date();
    api
      .post('submissions', {
        userId: user?._id ?? null,
        projectName: submission?.projectName ?? '',
        date: dateTime,
        lifecycle: submission?.lifecycle,
        domain: submission?.domain,
        region: submission?.region,
        roles: submission?.roles,
        submission: submission?.submission ?? {},
        completed: false,
      })
      .then((res) => {
        // update this.state.submissions object here
        let newSubmission = res.data;
        let submissions = this.state.submissions;
        submissions.unshift(newSubmission);
        this.setState({ submissions: submissions });
        this.setState({
          currentSubmissionIdx: this.state.submissions.length - 1,
        });
      });
  }

  // edit a survey that has already been completed
  editSurvey(index) {
    this.setState({ currentSubmissionIdx: index });
    let submission = this.state.submissions[index];
    this.props.history.push({
      pathname: '/SystemAssessment',
      state: {
        prevResponses: submission.submission,
        submission_id: submission._id,
      },
    });
  }

  render() {
    const handleClose = () => this.setState({ showDeleteWarning: false });

    if (!this.state.isLoggedIn) {
      return (
        <Grid container style={{ marginTop: '100px' }}>
          <Grid item md />
          <Grid item xs={10} md={7}>
            <Grid container>
              <Grid item xs={12}>
                <p>
                  Welcome‌ ‌to‌ ‌the‌ ‌Responsible AI System-Level Assessment (SLA), a tool that RAII offers to help
                  organizations design,‌ ‌develop,‌ ‌and‌ ‌implement ‌AI‌ ‌systems responsibly.‌ With‌ ‌our‌ ‌‌community‌ ‌of‌ ‌
                  subject‌ ‌matter‌ ‌experts‌ ‌ranging‌ ‌from‌ ‌engineers,‌ ‌to‌ ethicists,‌ ‌to‌ ‌policy‌ ‌makers,‌ ‌we‌ ‌have‌ examined
                  various ‌principles,‌ ‌whitepapers,‌ ‌and‌ policy‌ ‌documents‌ ‌published‌ ‌by‌ ‌academics,‌ ‌standards‌ ‌organizations,‌
                  and‌ ‌companies‌ and‌ ‌translated‌ ‌them‌ ‌into‌ ‌a comprehensive‌ ‌and easy-to-use assessment.
                </p>
              </Grid>
              <Grid item xs={12}>
                <p>
                  The SLA has more than 100 questions that evaluate an AI system’s residual risk along the Responsible AI
                  Implementation Framework’s six dimensions and their subdimensions. The framework’s dimensions include:
                  Systems Operations, Explainability & Interpretability, Accountability, Consumer Protection, Bias &
                  Fairness, and Robustness. The SLA can be used as an assessment and can also inform internal processes,
                  including those for development and deployment, compliance, and audit. ‌Whether‌ ‌you‌ ‌are‌ ‌‌considering ‌how‌ ‌
                  to‌ ‌integrate‌ ‌AI‌ ‌tools‌ ‌into‌ ‌your‌ ‌ business ‌or‌‌ ‌have‌ ‌already‌ ‌deployed‌ several‌ AI ‌models,‌ ‌this‌ ‌tool‌ ‌can help
                  your organization assess whether those efforts align with best practices.‌ ‌The ‌SLA ‌can‌ ‌be‌ used‌ during
                  design, before deployment, or during a system’s operation.
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2} md={3}>
            <Grid item md />
          </Grid>

        </Grid>
      );
    } else {
      return (
        <div>
          <div>
            <Box mt={10} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '50%',
                }}
              >
                {this.state?.user?.collabRole !== 'legalCompliance' && (
                  <LandingButton
                    variant="outlined"
                    type="button"
                    onClick={() => this.startSurvey()}
                  >
                    Start Assessment
                  </LandingButton>
                )}
                <LandingButton
                  variant="outlined"
                  type="button"
                  href={guidancePath}
                >
                  GUIDE LINK
                </LandingButton>
              </div>
            </div>
            <Assessment></Assessment>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '90%',
                }}
              >
                <AssessmentGrid
                  submissions={this.state.submissions}
                  userName={this.state?.user?.username}
                  collabRole={this.state?.user?.collabRole}
                  handleDelete={() => this.deleteSurvey()}
                  handleResume={(index) => this.resumeSurvey(index)}
                ></AssessmentGrid>
                <Box mt={4} />
              </div>
            </div>
            <Box mt={4} />
          </div>
        </div>
      );
    }
  }
}

export default withRouter(UserSubmissions);
