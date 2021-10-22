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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
      surveyProgressBar: 0,
      showModal: false,
      dimensionFilter: true,
      systemTypeFilter: true,
      authToken: localStorage.getItem('authToken'),
      submission_id: this?.props?.location?.state?.submission_id,
      user_id: this?.props?.location?.state?.user_id,
      localResponses: JSON.parse(localStorage.getItem('localResponses')),
      answers: new Map(),
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

    let questionDimension = [
      'projectDetails',
      'organizationalMaturity',
      'accountability',
      'data',
      'fairness',
      'interpretability',
      'robustness',
    ];

    let teamMaturity = ['No questions at this time'];
    this.setState({ systemType: systemType });
    this.setState({ stepperTitle: stepperTitle });
    this.setState({ activeStep: 0 });
    this.setState({ subDimensionStep: 0 });
    this.setState({ questionDimension: questionDimension });
    this.setState({ activeStepValue: questionDimension[0] });
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

  updateAnswer = (questionId, value, isArray) => {
    if (isArray) {
      let questionIdArray = this.state.answers.get(questionId) || [];
      let newArray = questionIdArray.includes(value)
        ? questionIdArray.filter((arrayValue) => value !== arrayValue)
        : [...questionIdArray, value];
      this.setState({ answers: this.state.answers.set(questionId, newArray) });
    } else {
      this.setState({ answers: this.state.answers.set(questionId, value) });
    }
  };

  finish = () => {
    console.log(this.state.answers);
  };

  async getQuestions() {
    api.get('questions/all').then((res) => {
      this.setState({ mount: false });
      var json = res.data;
      var allQuestions = json;

      console.log(res.data);
      this.setState({ allQuestions: allQuestions });
      this.setState({ dimensions: res.data.Dimensions });
      this.setState({ subdimensions: res.data.subDimensions });
      this.setState({
        questions: res.data.questions.sort((a, b) =>
          a.questionNumber > b.questionNumber ? 1 : -1
        ),
      });

      this.setState({
        projectDetails: this.state.questions.filter(
          (filterQuestions) => filterQuestions.trustIndexDimension == 1
        ),
      });

      const surveyQuestions = {
        projectDetails: this.state.questions.filter(
          (filterQuestions) => filterQuestions.trustIndexDimension == 1
        ),
        organizationalMaturity: this.state.questions.filter(
          (filterQuestions) => filterQuestions.trustIndexDimension == 2
        ),
        accountability: this.state.questions.filter(
          (filterQuestions) => filterQuestions.trustIndexDimension == 3
        ),
        data: this.state.questions.filter(
          (filterQuestions) => filterQuestions.trustIndexDimension == 4
        ),
        fairness: this.state.questions.filter(
          (filterQuestions) => filterQuestions.trustIndexDimension == 5
        ),
        interpretability: this.state.questions.filter(
          (filterQuestions) => filterQuestions.trustIndexDimension == 6
        ),
        robustness: this.state.questions.filter(
          (filterQuestions) => filterQuestions.trustIndexDimension == 7
        ),
      };

      this.setState({ surveyQuestions: surveyQuestions });
      console.log(this.state.surveyQuestions);

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

  handleDimensionFilter() {
    this.setState({ dimensionFilter: false });
  }

  handleSystemTypeFilter() {
    this.setState({ systemTypeFilter: false });
  }

  percent() {
    return this.state.model.getProgress();
  }

  // return to when we know how this will work
  addDimension(e) {
    const v = parseInt(e);
    if (this.state.dimArray.includes(v)) {
      const i = this.state.dimArray.indexOf(v);
      this.state.dimArray.splice(i);
    } else {
      this.state.dimArray.push(v);
    }
    this.setState({ dimArray: this.state.dimArray });
  }

  // return to when we know how this will work
  addSystemTypes(e) {
    const v = parseInt(e);
    if (this.state.roleFilters.includes(v)) {
      const i = this.state.roleFilters.indexOf(v);
      this.state.roleFilters.splice(i, 1);
    } else {
      this.state.roleFilters.push(v);
    }
    this.setState({ roleFilters: this.state.roleFilters });
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

  surveyProgressBarText = (activeStepValue) => {
    switch (activeStepValue) {
      case 'projectDetails':
        return '0%';
      case 'organizationalMaturity':
        return '25%';
      case 'accountability':
        return '50%';
      case 'data':
        return '75%';
      case 'fairness':
        return '85%';
      case 'interpretability':
        return '95%';
      case 'robustness':
        return '100%';
      default:
    }
  };

  surveyProgressBar() {
    if (this.state.activeStepValue === 'projectDetails') {
      this.setState({
        surveyProgressBar: 0,
      });
    } else if (this.state.activeStepValue === 'organizationalMaturity') {
      this.setState({
        surveyProgressBar: 25,
      });
    } else if (this.state.activeStepValue === 'accountability') {
      this.setState({
        surveyProgressBar: 50,
      });
    } else if (this.state.activeStepValue === 'data') {
      this.setState({
        surveyProgressBar: 75,
      });
    } else if (this.state.activeStepValue === 'fairness') {
      this.setState({
        surveyProgressBar: 85,
      });
    } else if (this.state.activeStepValue === 'interpretability') {
      this.setState({
        surveyProgressBar: 95,
      });
    } else if (this.state.activeStepValue === 'robustness') {
      this.setState({
        surveyProgressBar: 100,
      });
    }
  }

  async prevPage() {
    await this.setState({ activeStep: this.state.activeStep - 1 });
    this.setState({
      activeStepValue: this.state.questionDimension[this.state.activeStep],
    });
    window.scroll(0, 0);
    this.surveyProgressBar();
  }

  async nextSurveyPage() {
    await this.setState({ activeStep: this.state.activeStep + 1 });
    this.setState({
      activeStepValue: this.state.questionDimension[this.state.activeStep],
    });
    window.scroll(0, 0);
    this.surveyProgressBar();
  }

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
          {this.state.systemTypeFilter && (
            <Button
              onClick={() => this.handleSystemTypeFilter()}
              className="filter-button mr-2"
            >
              <CloseIcon />
              System Type 1
            </Button>
          )}
          {this.state.dimensionFilter && (
            <Button
              onClick={() => this.handleDimensionFilter()}
              className="filter-button"
            >
              <CloseIcon />
              Dimension 1
            </Button>
          )}
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
            <div>
              {this.state.surveyQuestions[this.state.activeStepValue].map(
                (questions) => (
                  <SurveyTest
                    key={questions._id}
                    questionName={questions.question}
                    responseType={questions.responseType}
                    surveyResponses={questions.responses}
                    questionId={questions._id}
                    updateAnswer={this.updateAnswer}
                    value={this.state.answers.get(questions._id)}
                  ></SurveyTest>
                )
              )}
            </div>
          </div>
        </div>

        <div className="dimensionNav">
          <div className="stepper-box">
            <Stepper orientation="vertical" activeStep={this.state.activeStep}>
              {console.log(this.state.activeStep)}
              {console.log(this.state.subDimensionStep)}
              {this.state.stepperTitle.map((stepperTitle, index) => {
                return (
                  <Step key={index}>
                    <StepLabel>{stepperTitle}</StepLabel>
                    <StepContent> 0% percent</StepContent>
                    <StepContent>
                      <LinearProgress
                        className="stepper-progress-bar"
                        variant="determinate"
                        value={0}
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
            value={this.state.surveyProgressBar}
          ></LinearProgress>
          <Box mt={2} />
          <div> {this.surveyProgressBarText(this.state.activeStepValue)}</div>
          <Box mt={4} />
          <Accordion>
            <Accordion.Toggle className="accordian-style" eventKey="9">
              Dimensions
            </Accordion.Toggle>
            <Box mt={4} />
            <Accordion.Collapse eventKey="9">
              <Form>
                {this.state.dimArray.map((dimension, index) => {
                  return this.state.dimArray.length ? (
                    <div className="check-box-height">
                      <FormControlLabel
                        key={index}
                        label={dimension}
                        control={<Checkbox className="survey-check-box" />}
                      />
                    </div>
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
                    <div className="check-box-height">
                      <FormControlLabel
                        key={index}
                        label={systemType}
                        control={<Checkbox className="survey-check-box" />}
                      />
                    </div>
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
