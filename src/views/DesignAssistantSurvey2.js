import $ from 'jquery';
import api from '../api';
import Login from './Login';
import ReactGa from 'react-ga';
import showdown from 'showdown';
import * as Survey from 'survey-react';
import { Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import * as widgets from 'surveyjs-widgets';
import { withRouter } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { ToastContainer, toast } from 'react-toastify';
import { getLoggedInUser } from '../helper/AuthHelper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';

import SurveyTest from './../Components/Survey/Survey';

import 'react-toastify/dist/ReactToastify.css';

// set up survey styles and properties for rendering html
Survey.StylesManager.applyTheme('bootstrapmaterial');

Survey.defaultBootstrapMaterialCss.progressBar =
  'progress-bar bg-custom progress-bar-striped';

Survey.defaultBootstrapMaterialCss.container = 'survey-container';

Survey.Serializer.addProperty('page', {
  name: 'navigationTitle:string',
  isLocalizable: true,
});

Survey.Serializer.addProperty('question', 'alttext:text');

// remove localization strings for progress bar
// https://surveyjs.answerdesk.io/ticket/details/t2551/display-progress-bar-without-text
// Asked by: MDE | Answered by: Andrew Telnov
var localizedStrs =
  Survey.surveyLocalization.locales[Survey.surveyLocalization.defaultLocale];
localizedStrs.progressText = '';

// array of dimension names used to create navigation cards

class DesignAssistantSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: {},
      roleFilters: [],
      domainFilters: [],
      regionFilters: [],
      lifecycleFilters: [],
      systemType: [],
      stepperTitle: [],
      dimArray: [],
      showModal: false,
      authToken: localStorage.getItem('authToken'),
      submission_id: this?.props?.location?.state?.submission_id,
      user_id: this?.props?.location?.state?.user_id,
      localResponses: JSON.parse(localStorage.getItem('localResponses')),
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenEmptyModal = this.handleOpenEmptyModal.bind(this);
    this.handleCloseEmptyModal = this.handleCloseEmptyModal.bind(this);
  }

  // Request questions JSON from backend
  componentDidMount() {
    let systemType = [
      'System 1',
      'System 2',
      'System 3',
      'System 4',
      'System 5',
      'System 6',
    ];
    let stepperTitle = [
      'Project Information',
      'Organization Maturity',
      'Team Maturity',
      'System Information',
    ];
    this.setState({ systemType: systemType });
    this.setState({ stepperTitle: stepperTitle });
    this.setState({ activeStep: 0 });

    widgets.nouislider(Survey);

    ReactGa.pageview(window.location.pathname + window.location.search);

    api.get('dimensions/names').then((res) => {
      this.setState({ dimArray: res.data.dimensions });
    });

    api.get('metadata').then((res) => {
      this.setState({ metadata: res.data });
    });
    this.getQuestions();
  }

  componentDidUpdate() {
    // make answeres persistent across page reloads
    if (this.state.model?.data !== undefined) {
      localStorage.setItem(
        'localResponses',
        JSON.stringify(this.state.model?.data)
      );
    }

    // associate submissions with the user if they sign-in mid-survey
    if (!this.state?.user_id) {
      getLoggedInUser().then((user) => {
        if (user) this.setState({ user_id: user._id });
      });
    }
  }

  // clear local storage before navigating away
  componentWillUnmount() {
    localStorage.removeItem('localResponses');
  }

  async getQuestions(submissions) {
    api
      .get('questions/all', {
        params: {
          roles: this.state.roleFilters,
          domains: this.state.domainFilters,
          regions: this.state.regionFilters,
          lifecycles: this.state.lifecycleFilters,
        },
      })
      .then((res) => {
        this.setState({ mount: false });
        var json = res.data;
        var allQuestions = json;
        this.setState({ allQuestions: allQuestions });

        this.setState({
          questions: res.data.questions.sort((a, b) =>
            a.questionNumber > b.questionNumber ? 1 : -1
          ),
        });
        this.setState({
          projectInformationQuestions: this.state.questions.filter(
            (filterQuestions) => filterQuestions.trustIndexDimension == 1
          ),
        });

        this.setState({
          systemInformation: this.state.questions.filter(
            (filterQuestions) => filterQuestions.trustIndexDimension != 1
          ),
        });

        console.log(this.state.slicedQuestions);

        // replace double escaped characters so showdown correctly renders markdown frontslashes and newlines
        var stringified = JSON.stringify(json);
        stringified = stringified.replace(/\\\\n/g, '\\n');
        stringified = stringified.replace(/\\\//g, '/');
        json = JSON.parse(stringified);

        const model = new Survey.Model(json);
        const converter = new showdown.Converter();
        // Set json and model
        this.setState({ json: json });
        this.setState({ model });

        // Set survey responses to survey model
        if (this?.props?.location?.state?.prevResponses) {
          model.data = this.props.location.state.prevResponses;
          let questionsAnswered = Object.keys(model.data);
          let lastQuestionAnswered =
            questionsAnswered[questionsAnswered.length - 1];
          let lastPageAnswered = model.pages.find((page) =>
            page.elements.find(
              (question) => question.name === lastQuestionAnswered
            )
          );
          model.currentPageNo = lastPageAnswered?.visibleIndex ?? 0;
        }
      });
  }

  nextPath(path) {
    this.props.history.push({
      pathname: path,
      state: { questions: this.state.json, responses: this.state.model.data },
    });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleOpenEmptyModal() {
    this.setState({ showEmptyModal: true });
  }

  handleCloseEmptyModal() {
    this.setState({ showEmptyModal: false });
  }

  percent() {
    return this.state.model.getProgress();
  }

  resetSurvey() {
    // do we need to delete submission object here?
    // because we would need to call the database here
    this.state.model.clear();
    this.handleCloseModal();
    this.handleCloseEmptyModal();
    window.location.pathname = '/';
  }

  prevPage() {
    let stepCount = this.state.activeStep - 1;
    this.setState({ activeStep: stepCount });
    console.log(this.state.activeStep);

    if (this.state.activeStep === 0) {
      this.setState({
        projectInformationQuestions: this.state.projectInformationQuestions,
      });
    }
  }

  handleTitleText = (activeStep) => {
    switch (activeStep) {
      case 0:
        return 'Project Information';
      case 1:
        return 'Organizational Maturity';
      case 2:
        return 'Team Maturity';
      case 3:
        return 'System Information';
      default:
    }
  };

  nextSurveyPage() {
    let stepCount = this.state.activeStep + 1;
    this.setState({ activeStep: stepCount });
    console.log(this.state.activeStep);
    if (this.state.activeStep === 2) {
      this.setState({
        projectInformationQuestions: this.state.systemInformation,
      });
    }
  }

  //   save(completed = false) {
  //     // when we click save, we should already have a model saved to the database
  //     // i.e. the index will always point to a valid submission
  //     // so just make an update call

  //     let title = this.state.json?.pages[0]?.elements?.find(
  //       (q) => q?.title?.default === 'Title of project'
  //     );
  //     let dateTime = new Date();
  //     let projectName = this.state.model.data[title?.name] ?? '';
  //     let endpoint = 'submissions';
  //     if (this.state.submission_id) {
  //       endpoint = 'submissions/update/' + this.state.submission_id;
  //     }

  //     api
  //       .post(endpoint, {
  //         userId: this.state?.user_id,
  //         submission: this.state.model.data,
  //         date: dateTime,
  //         projectName: projectName,
  //         completed: completed,
  //         domain: this.state.domainFilters,
  //         region: this.state.regionFilters,
  //         roles: this.state.roleFilters,
  //         lifecycle: this.state.lifecycleFilters,
  //       })
  //       .then((res) => {
  //         toast('Saving Responses', {
  //           toastId: 'saving',
  //         });
  //         let submission = res.data;
  //         this.setState({ submission_id: submission._id });
  //       });
  //   }

  render() {
    var number = 1;
    return this.state.model ? (
      <div>
        <div className="d-flex justify-content-center col">
          <h1>RAI Certification</h1>
        </div>
        <Box mt={10} />
        <div className="d-flex justify-content-end col">
          <div>CLEAR FILTERS</div>
          <Box mr={4} />
          <Button className="filter-button mr-2">
            <CloseIcon />
            System Type 1
          </Button>
          <Button className="filter-button">
            <CloseIcon />
            Dimension 1
          </Button>
        </div>
        <Box mt={18} />
        <div className="survey-container">
          <div className="survey-padding">
            <div className="survey-title-row">
              <h1>{this.handleTitleText(this.state.activeStep)}</h1>
              <div>
                <Chip className="chip-yellow" label="Sample Tag" />
                <Chip className="chip-blue" label="Sample Tag" />
              </div>
            </div>
            <Box mt={4} />
            {this.state.activeStep === 0 || this.state.activeStep === 3 ? (
              <div>
                {this.state.projectInformationQuestions.map((questions, i) => (
                  <SurveyTest
                    key={i}
                    questionName={questions.question}
                    responseType={questions.responseType}
                    surveyResponses={questions.responses}
                    questionNumber={questions.questionNumber}
                  ></SurveyTest>
                ))}
              </div>
            ) : (
              <div>No questions currently at this point</div>
            )}
          </div>
        </div>

        <div className="dimensionNav">
          <div className="stepper-box">
            <Stepper orientation="vertical" activeStep={this.state.activeStep}>
              {console.log(this.state.activeStep)}
              {this.state.stepperTitle.map((stepperTitle, index) => {
                return (
                  <Step key={index}>
                    <StepLabel>{stepperTitle}</StepLabel>
                    <StepContent> 25% Complete </StepContent>
                    <StepContent>
                      <LinearProgress
                        className="stepper-progress-bar"
                        variant="determinate"
                        value={25}
                      ></LinearProgress>
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </div>
          <Box mt={4} />
          <LinearProgress
            className="linear-progress-bar"
            variant="determinate"
            value={25}
          ></LinearProgress>
          <Box mt={2} />
          <div> 25% Complete</div>
          <Box mt={4} />
          <Accordion>
            <Accordion.Toggle className="accordian-style" eventKey="9">
              Dimensions
            </Accordion.Toggle>
            <Box mt={4} />
            <Accordion.Collapse eventKey="9">
              <Form>
                {this.state.dimArray.map((dimension, index) => {
                  return index + 1 !== this.state.dimArray.length ? (
                    <Form.Check
                      className="checkbox-text"
                      type="checkbox"
                      checked={this.state.dimArray.includes(index + 1)}
                      label={dimension}
                      id={index}
                      key={index}
                      value={index + 1}
                      onChange={(e) => this.addRole(e.target.value)}
                    />
                  ) : null;
                })}
              </Form>
            </Accordion.Collapse>
          </Accordion>
          <Box mt={4} />
          <Accordion>
            <Accordion.Toggle className="accordian-style" eventKey="9">
              System Types
            </Accordion.Toggle>
            <Box mt={4} />
            <Accordion.Collapse eventKey="9">
              <Form>
                {this.state.systemType.map((systemType, index) => {
                  return index + 1 !== this.state.systemType.length ? (
                    <Form.Check
                      className="checkbox-text"
                      type="checkbox"
                      checked={this.state.systemType.includes(index + 1)}
                      label={systemType}
                      id={index}
                      key={index}
                      value={index + 1}
                      onChange={(e) => this.addRole(e.target.value)}
                    />
                  ) : null;
                })}
              </Form>
            </Accordion.Collapse>
          </Accordion>
        </div>

        <div className="container" style={{ paddingTop: '2em' }}>
          <div className="d-flex justify-content-center col"></div>
        </div>
        {this.state.mount ? (
          <Survey.Survey
            model={this.state.model}
            onComplete={this.onComplete}
          />
        ) : null}
        <div>
          <Box mt={8} />
          <div>
            <div className="row no-gutters">
              <div className="d-flex justify-content-start col">
                <Button
                  id="surveyNav"
                  className="btn btn-primary mr-2"
                  onClick={() => this.prevPage()}
                  disabled={this.state.activeStep === 0}
                >
                  PREVIOUS
                </Button>
              </div>
              <div className="d-flex justify-content-center col">
                <Button
                  id="surveyNav"
                  className="btn btn-primary mr-2"
                  onClick={() => this.nextSurveyPage()}
                >
                  CONTINUE
                </Button>
              </div>
              <div className="d-flex justify-content-end col">
                <Button
                  className="btn btn-save mr-2"
                  id="saveButton"
                  onClick={() => this.save()}
                >
                  SAVE
                </Button>
                <Button
                  className="bt btn-primary"
                  onClick={() => this.finish()}
                >
                  FINISH
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.showModal}
        >
          <ModalHeader>
            <ModalTitle id="contained-modal-title-vcenter">
              Please Confirm
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>
              Please confirm that you want to reset everything and start over.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.handleCloseModal}>No</Button>
            <Button id="resetButton" onClick={() => this.resetSurvey()}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.showEmptyModal}
        >
          <ModalHeader closeButton>
            <ModalTitle id="contained-modal-title-vcenter">
              No Questions
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>There are no questions in the database.</p>
          </ModalBody>
          <ModalFooter>
            <Button id="resetButton" onClick={() => this.resetSurvey()}>
              Go Back
            </Button>
          </ModalFooter>
        </Modal>
        <Login />
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          closeButton={false}
        />
      </div>
    ) : null;
  }
}

export default withRouter(DesignAssistantSurvey);
