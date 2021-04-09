import React, { Component } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import { getLoggedInUser } from '../helper/AuthHelper';
import api from '../api';
import ReactGa from 'react-ga';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';

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
          user_id: this.state?.user?._id,
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
        user_id: this.state?.user?._id
      },
    });
  }

  render() {
    const handleClose = () => this.setState({ showDeleteWarning: false });
    return (
      <div>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.showDeleteWarning}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you would like to delete this submission?
          </Modal.Body>
          <Modal.Footer>
            <Button id="DeleteSurveyButton" onClick={() => this.deleteSurvey()}>
              Yes
            </Button>
            <Button onClick={() => handleClose()}>Cancel</Button>
          </Modal.Footer>
        </Modal>
        <div>
          <div className="card">
            <div className="card-header">Existing Surveys</div>
            <div className="card-body">
              <Table bordered responsive className="survey-results-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Last Updated</th>
                    <th width="120px"></th>
                    <th width="100px"></th>
                    <th width="75px"></th>
                    <th width="75px"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.submissions.map((submission, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {submission?.projectName
                            ? submission?.projectName
                            : 'No Project Name'}
                        </td>
                        <td>
                          {new Date(submission.date).toLocaleString('en-US', {
                            timeZone:
                              Intl?.DateTimeFormat()?.resolvedOptions()
                                ?.timeZone ?? 'UTC',
                          })}
                        </td>
                        <td width="120px" className="text-center">
                          {!submission.completed && (
                            <Button
                              block
                              onClick={() => {
                                this.resumeSurvey(index);
                                StartSurveyHandler();
                              }}
                            >
                              Resume
                            </Button>
                          )}
                          {submission.completed && (
                            <Button
                              className="results-button"
                              block
                              onClick={() => {
                                this.resumeSurvey(index);
                                StartSurveyHandler();
                              }}
                            >
                              Results
                            </Button>
                          )}
                        </td>
                        <td width="100px">
                          <Button
                            block
                            onClick={() => {
                              this.cloneSurvey(index);
                            }}
                          >
                            Clone
                          </Button>
                        </td>
                        <td width="75px" className="text-center">
                          {submission.completed && (
                            <IconButton
                              aria-label="edit survey"
                              onClick={() => {
                                this.editSurvey(index);
                              }} >
                              <EditIcon />
                            </IconButton>
                          )}
                        </td>
                        <td width="75px" className="text-center">
                          <IconButton
                            aria-label="delete survey"
                            onClick={() => {
                              this.showDeleteWarning(index);
                            }} >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <div className="float-right mr-3 mt-2">
          {this.state?.user && (<Button onClick={() => this.startSurvey()}>Start New Survey</Button>)}
        </div>
      </div>
    );
  }
}

export default withRouter(UserSubmissions);
