import React, { Component } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import { getLoggedInUser } from '../helper/AuthHelper';
import ProjectCard from '../Components/ProjectCard';
import api from '../api';
import ReactGa from 'react-ga';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    width: 264,
    borderRadius: '10px 10px 0px 0px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cardContent: {
    backgroundColor: '#E5EEFF',
  },
});

const StartSurveyHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'Clicked the Start Survey Button',
  });
};

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
        <ProjectCard
          projectName={'test'}
          assessmentType={'test'}
          updatedBy={'test'}
          updatedOn={'test'}
        ></ProjectCard>

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
    );
  }
}

export default withRouter(UserSubmissions);
