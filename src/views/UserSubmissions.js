import React, { Component } from 'react';
import { getLoggedInUser } from '../helper/AuthHelper';
import { Button, Box, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AssessmentGrid from '../Components/AssessmentGrid';
import Assessment from '../Components/Assessment';
import Signup from './../views/Signup';

import api from '../api';
import ReactGa from 'react-ga';
import { withRouter } from 'react-router-dom';

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

const StartSurveyHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'Clicked the Start Survey Button',
  });
};

const guidancePath =
  'https://docs.google.com/presentation/d/1EDPhyRhIsiOrujLcHQv_fezXfgOz4Rl7a8lyOM_guoA/edit#slide=id.p1';
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
            var submissions = res.data;
            this.setState(submissions);
          });
      }
    });
  }

  startSurvey() {
    this.props.history.push({
      pathname: '/AccessToCareAssessment',
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
        pathname: '/AccessToCareAssessment',
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
      pathname: '/AccessToCareAssessment',
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
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              marginTop: '2rem',
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
              <Signup signedOut={true} admin={true} />
              <LandingButton
                variant="outlined"
                type="button"
                href={guidancePath}
              >
                GUIDE LINK
              </LandingButton>
            </div>
            <Box mt={1} />
          </div>
          <Box mt={10} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              height: '400px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
              }}
            >
              With‌ ‌our‌ ‌esteemed‌ ‌community‌ ‌of‌ ‌subject‌ ‌matter‌
              ‌experts‌ ‌ranging‌ ‌from‌ ‌engineers,‌ ‌to‌ ethicists,‌ ‌to‌
              ‌policy‌ ‌makers,‌ ‌we‌ ‌have‌ ‌taken‌ ‌the‌ ‌most‌ ‌cited‌
              ‌principles,‌ ‌whitepapers,‌ ‌and‌ policy‌ ‌documents‌ ‌published‌
              ‌by‌ ‌academics,‌ ‌standards‌ ‌organizations,‌ ‌and‌ ‌companies‌
              and‌ ‌translated‌ ‌them‌ ‌into‌ ‌comprehensive‌ ‌questions.‌
              <Box mt={5} />
              <div>
                Our‌ ‌hope‌ ‌is‌ ‌that‌ ‌you‌ ‌will‌ ‌work‌ ‌with‌ ‌your‌
                ‌colleagues‌ ‌who‌ ‌are‌ ‌responsible‌ ‌for‌ ‌different‌
                aspects‌ ‌of‌ ‌your‌ ‌business‌ ‌to‌ ‌fill‌ ‌out‌ ‌the‌ ‌Design‌
                ‌Assistant.‌ ‌Whether‌ ‌you‌ ‌are‌ ‌just‌ ‌thinking‌ about‌
                ‌how‌ ‌to‌ ‌integrate‌ ‌AI‌ ‌tools‌ ‌into‌ ‌your‌ ‌business,‌
                ‌or‌ ‌you‌ ‌have‌ ‌already‌ ‌deployed‌ several‌ ‌models,‌ ‌this‌
                ‌tool‌ ‌is‌ ‌for‌ ‌you.‌ ‌We‌ ‌do‌ ‌think‌ ‌that‌ ‌these‌
                ‌questions‌ ‌are‌ ‌best‌ ‌to‌ ‌think‌ about‌ ‌at‌ ‌the‌ ‌start‌
                ‌of‌ ‌your‌ ‌project,‌ ‌however,‌ ‌we‌ ‌do‌ ‌think‌ ‌that‌ ‌the‌
                ‌Design‌ ‌Assistant‌ ‌can‌ ‌be‌ used‌ ‌throughout‌ ‌the‌
                ‌lifecycle‌ ‌of‌ ‌your‌ ‌project!‌
              </div>
            </div>
          </div>
        </div>
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
            <Box mb={5} />
            <Box mt={10} />
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
