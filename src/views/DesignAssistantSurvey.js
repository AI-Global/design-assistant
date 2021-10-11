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
import LinearProgress from '@material-ui/core/LinearProgress';

import 'react-toastify/dist/ReactToastify.css';

// set up survey styles and properties for rendering html
Survey.StylesManager.applyTheme('bootstrapmaterial');

Survey.defaultBootstrapMaterialCss.progressBar =
  'progress-bar bg-custom progress-bar-striped';

Survey.defaultBootstrapMaterialCss.checkBox =
  'progress-bar bg-custom progress-bar-striped';

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
      activeStep: 0,
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
      .get('questions', {
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

        if (json.pages.length < 1) {
          this.handleOpenEmptyModal();
        }

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

        if (this?.props?.location?.state?.filters && !submissions) {
          this.setState({
            roleFilters: this.props.location.state.filters.roles,
          });
          this.setState({
            domainFilters: this.props.location.state.filters.domain,
          });
          this.setState({
            regionFilters: this.props.location.state.filters.region,
          });
          this.setState({
            lifecycleFilters: this.props.location.state.filters.lifecycle,
          });
        }

        if (submissions) {
          model.data = submissions;
        }

        if (this.state.localResponses) {
          model.data = this.state.localResponses;
        }

        model.onTextMarkdown.add(function (model, options) {
          var str = converter.makeHtml(options.text);
          options.html = str;
        });

        // add tooltip
        model.onAfterRenderPage.add(function (model, options) {
          const node = options.htmlElement.querySelector('h1');
          if (node) {
            node.classList.add('section-header');
          }
          // wait to load jquery to fix testing bug
          // https://stackoverflow.com/a/63217419
          setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip({
              boundary: 'viewport',
            });
          }, 2100);
        });
        //change labels to 'h5' to bold them
        model.onAfterRenderQuestion.add(function (model, options) {
          let title = options.htmlElement.querySelector('h5');
          if (title) {
            // add tooltip for question if alttext has default value
            let altTextHTML = '';
            let childIndent = '';
            if (
              options.question.alttext &&
              options.question.alttext.hasOwnProperty('default')
            ) {
              let altText = converter.makeHtml(
                options.question.alttext.default.replace(/"/g, '&quot;')
              );
              altText = `<div class="text-justify">${altText}</div>`.replace(
                /"/g,
                '&quot;'
              );
              altTextHTML = `<i class="fas fa-info-circle ml-2" data-toggle="tooltip" data-html="true" title="${altText}"></i>`;
            }
            if (options.question.visibleIf) {
              childIndent = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            }
            title.outerHTML =
              '<label for="' +
              options.question.inputId +
              '" class="' +
              title.className +
              '"><span class="field-name">' +
              childIndent +
              title.innerText +
              '</span>' +
              altTextHTML +
              '</label>';
            // add tooltip for answers if alttext has default value
            options.htmlElement.querySelectorAll('input').forEach((element) => {
              if (
                options.question.alttext &&
                options.question.alttext.hasOwnProperty(element.value)
              ) {
                const div = element.closest('div');
                div.classList.add('d-flex');
                const i = document.createElement('span');
                let altText = converter.makeHtml(
                  options.question.alttext[element.value].default.replace(
                    /"/g,
                    '&quot;'
                  )
                );
                altText = `<div class="text-justify">${altText}</div>`.replace(
                  /"/g,
                  '&quot;'
                );
                i.innerHTML = `<i class="fas fa-info-circle ml-2" data-toggle="tooltip" data-html="true" title="${altText}"></i>`;
                div.appendChild(i);
              }
            });
          }
        });
        this.setState({ mount: true });
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
    this.state.model.prevPage();
    this.setState(this.state); // force re-render to update buttons and % complete
  }

  nextPage() {
    this.state.model.nextPage();
    this.setState(this.state); // force re-render to update buttons and % complete
  }

  save(completed = false) {
    // when we click save, we should already have a model saved to the database
    // i.e. the index will always point to a valid submission
    // so just make an update call

    let title = this.state.json?.pages[0]?.elements?.find(
      (q) => q?.title?.default === 'Title of project'
    );
    let dateTime = new Date();
    let projectName = this.state.model.data[title?.name] ?? '';
    let endpoint = 'submissions';
    if (this.state.submission_id) {
      endpoint = 'submissions/update/' + this.state.submission_id;
    }

    api
      .post(endpoint, {
        userId: this.state?.user_id,
        submission: this.state.model.data,
        date: dateTime,
        projectName: projectName,
        completed: completed,
        domain: this.state.domainFilters,
        region: this.state.regionFilters,
        roles: this.state.roleFilters,
        lifecycle: this.state.lifecycleFilters,
      })
      .then((res) => {
        toast('Saving Responses', {
          toastId: 'saving',
        });
        let submission = res.data;
        this.setState({ submission_id: submission._id });
      });
  }

  finish() {
    this.save(true);
    this.state.model.doComplete();
    this.nextPath('/Results/');
  }

  onComplete(survey, options) {
    console.log('Survey results: ' + JSON.stringify(survey.data));
  }

  addRole(e) {
    const v = parseInt(e);
    if (this.state.roleFilters.includes(v)) {
      const i = this.state.roleFilters.indexOf(v);
      this.state.roleFilters.splice(i, 1);
    } else {
      this.state.roleFilters.push(v);
    }
    this.setState({ roleFilters: this.state.roleFilters });
  }

  addDomain(e) {
    const v = parseInt(e);
    if (this.state.domainFilters.includes(v)) {
      const i = this.state.domainFilters.indexOf(v);
      this.state.domainFilters.splice(i, 1);
    } else {
      this.state.domainFilters.push(v);
    }
    this.setState({ domainFilters: this.state.domainFilters });
  }

  addRegion(e) {
    const v = parseInt(e);
    if (this.state.regionFilters.includes(v)) {
      const i = this.state.regionFilters.indexOf(v);
      this.state.regionFilters.splice(i, 1);
    } else {
      this.state.regionFilters.push(v);
    }
    this.setState({ regionFilters: this.state.regionFilters });
  }

  addLifecycle(e) {
    const v = parseInt(e);
    if (this.state.lifecycleFilters.includes(v)) {
      const i = this.state.lifecycleFilters.indexOf(v);
      this.state.lifecycleFilters.splice(i, 1);
    } else {
      this.state.lifecycleFilters.push(v);
    }
    this.setState({ lifecycleFilters: this.state.lifecycleFilters });
  }

  applyFilters() {
    var submissions = this.state.model.data;
    this.getQuestions(submissions);
  }

  navPage(pageNumber) {
    const survey = this.state.model;
    survey.currentPage = survey.pages[pageNumber];
    this.setState(this.state);
  }

  /**
   * Returns true if a child's trigger is included in the answers
   */
  shouldDisplayNav(child) {
    let visibleIfArray = child.visibleIf.split('or ');
    let show = false;
    visibleIfArray.forEach((visibleIf) => {
      var parId = visibleIf.split('{')[1].split('}')[0];
      var resId = visibleIf.split("'")[1].split("'")[0];

      if (this.state?.model?.data[parId]) {
        if (Array.isArray(this.state.model.data[parId])) {
          if (this.state.model.data[parId].includes(resId)) {
            show = true;
          }
        } else {
          if (this.state.model.data[parId] === resId) {
            show = true;
          }
        }
      }
    });
    return show;
  }

  clearFilter(filter) {
    switch (filter) {
      case 'roles':
        this.setState({ roleFilters: [] });
        break;
      case 'domain':
        this.setState({ domainFilters: [] });
        break;
      case 'region':
        this.setState({ regionFilters: [] });
        break;
      case 'lifecycle':
        this.setState({ lifecycleFilters: [] });
        break;
      default:
        console.log('not a valid filter');
    }
  }

  render() {
    var number = 1;
    return this.state.model ? (
      <div>
        <div className="dimensionNav">
          <div className="stepper-box">
            <Stepper orientation="vertical" activeStep={this.state.activeStep}>
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

                    <Accordion.Collapse eventKey={index + 1}>
                      <StepContent>
                        {this?.state?.json?.pages?.map((page, index) => {
                          return page.name
                            .toLowerCase()
                            .includes(
                              stepperTitle.substring(0, 4).toLowerCase()
                            )
                            ? page.elements.map((question, i) => {
                                return !question.name.includes('other') &&
                                  (!question.visibleIf ||
                                    this.shouldDisplayNav(question)) ? (
                                  <Button
                                    style={{ margin: '0.75em' }}
                                    key={i}
                                    id={
                                      this.state.model.data[question.name]
                                        ? 'answered'
                                        : 'unanswered'
                                    }
                                    onClick={() => this.navPage(index)}
                                  >
                                    {question.visibleIf ? '' : number++}
                                  </Button>
                                ) : null;
                              })
                            : null;
                        })}
                      </StepContent>
                    </Accordion.Collapse>
                  </Step>
                );
              })}
            </Stepper>
          </div>
          <Box mt={4} />
          <div class="filter-text">Dimensions</div>
          <Box mt={4} />
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
          <Box mt={4} />
          <div class="filter-text">SystemType</div>
          <Box mt={4} />
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
        </div>
        <div className="container" style={{ paddingTop: '2em' }}>
          <div className="d-flex justify-content-center col">
            {this.percent()}%
          </div>
        </div>
        {this.state.mount ? (
          <Survey.Survey
            model={this.state.model}
            onComplete={this.onComplete}
          />
        ) : null}
        <div>
          <div>
            <div className="row no-gutters">
              <div className="d-flex justify-content-start col">
                <Button
                  id="surveyNav"
                  className="btn btn-primary mr-2"
                  onClick={() => this.prevPage()}
                  disabled={this.state.model.isFirstPage}
                >
                  PREVIOUS
                </Button>
              </div>
              <div className="d-flex justify-content-center col">
                <Button
                  id="surveyNav"
                  className="btn btn-primary mr-2"
                  onClick={() => this.nextPage()}
                  disabled={this.state.model.isLastPage}
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
