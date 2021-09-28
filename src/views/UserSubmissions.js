import React, { Component } from 'react';
import { getLoggedInUser } from '../helper/AuthHelper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import ProjectCard from '../Components/ProjectCard';
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

const ViewAllButton = withStyles(() => ({
  root: {
    width: '290px',
    borderRadius: '8px',
    border: '1px solid',
    backgroundColor: '#FFFFFF',
    borderColor: '#C9D7E9',
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

const faqPath =
  '/https://ai-global.org/2020/04/28/creating-a-responsible-ai-trust-index-a-unified-assessment-to-assure-the-responsible-design-development-and-deployment-of-ai/';

const guidancePath =
  '/https://docs.google.com/presentation/d/1EDPhyRhIsiOrujLcHQv_fezXfgOz4Rl7a8lyOM_guoA/edit#slide=id.p1';
class UserSubmissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSubmissionIdx: 0,
      authToken: localStorage.getItem('authToken'),
      submissions: [],
      showDeleteWarning: false,
    };
  }

  componentDidMount() {
    // get the logged in user and their submissions from backend
    getLoggedInUser().then((user) => {
      if (user) {
        this.setState({ user: user });
        api.get('submissions/user/' + user._id).then((res) => {
          var submissions = res.data;
          this.setState(submissions);
        });
      }
    });
  }

  startSurvey() {
    this.props.history.push({
      pathname: '/DesignAssistantSurvey',
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

        this.props.history.push({
          pathname: '/Results',
          state: { questions: json, responses: submission.submission ?? {} },
        });
      });
    } else {
      // If survey is not completed, pass previous submissions so SruveyJS can load them into the model
      // so user can continue
      this.props.history.push({
        pathname: '/DesignAssistantSurvey',
        state: {
          prevResponses: submission.submission,
          submission_id: submission._id,
          filters: {
            roles: submission.roles,
            domain: submission.domain,
            region: submission.region,
            lifecycle: submission.lifecycle,
          },
        },
      });
    }
  }

  showDeleteWarning(index) {
    this.setState({ currentSubmissionIdx: index });
    this.setState({ showDeleteWarning: true });
  }

  deleteSurvey() {
    console.log('fire?');
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
      pathname: '/DesignAssistantSurvey',
      state: {
        prevResponses: submission.submission,
        submission_id: submission._id,
      },
    });
  }

  render() {
    const handleClose = () => this.setState({ showDeleteWarning: false });
    return (
      <div>
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
            <LandingButton
              variant="outlined"
              type="button"
              onClick={this.startSurvey}
            >
              START NEW SURVEY
            </LandingButton>
            <LandingButton variant="outlined" type="button" href={faqPath}>
              FREQUENTLY ASKED QUESTIONS
            </LandingButton>
            <LandingButton variant="outlined" type="button" href={guidancePath}>
              GUIDE LINK
            </LandingButton>
          </div>
        </div>
        <Box mb={5} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              width: '60%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <Box
              height={900}
              width={650}
              border={1}
              borderColor="#DEE6F0"
              borderRadius={10}
            >
              <div className="surveyTitle">In Progress</div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  height: '85%',
                }}
              >
                <ProjectCard
                  status={'pending Review'}
                  projectName={'Project Name'}
                  updatedBy={'John'}
                  updatedOn={'May 26, 2019'}
                  handleDeleteClick={this.deleteSurvey}
                ></ProjectCard>
                <ProjectCard
                  status={'pending Review'}
                  projectName={'Project Name'}
                  updatedBy={'John'}
                  updatedOn={'May 26, 2019'}
                  handleDeleteClick={this.deleteSurvey}
                ></ProjectCard>
                <Box mt={4} />
                <ViewAllButton>View All</ViewAllButton>
              </div>
            </Box>

            <Box
              height={900}
              width={650}
              border={1}
              borderColor="#DEE6F0"
              borderRadius={10}
            >
              <div className="surveyTitle">Completed</div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  height: '85%',
                }}
              >
                <ProjectCard
                  status={'pending Review'}
                  projectName={'Project Name'}
                  updatedBy={'John'}
                  updatedOn={'May 26, 2019'}
                  handleDeleteClick={this.deleteSurvey}
                ></ProjectCard>
                <ProjectCard
                  status={'pending Review'}
                  projectName={'Project Name'}
                  updatedBy={'John'}
                  updatedOn={'May 26, 2019'}
                  handleDeleteClick={this.deleteSurvey}
                ></ProjectCard>
                <Box mt={4} />
                <ViewAllButton>View All</ViewAllButton>
              </div>
            </Box>
          </div>
          {this.state.submissions.map((submission, index) => {
            <ProjectCard
              key={index}
              projectName={
                submission?.projectName
                  ? submission?.projectName
                  : 'No Project Name'
              }
              assessmentType={'test'}
              updatedBy={this.state.user}
              updatedOn={new Date(submission.date).toLocaleString('en-US', {
                timeZone:
                  Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ?? 'UTC',
              })}
              handleDeleteClick={this.deleteSurvey()}
            ></ProjectCard>;
          })}
        </div>
        <Box mt={4} />
      </div>
    );
  }
}

export default withRouter(UserSubmissions);
