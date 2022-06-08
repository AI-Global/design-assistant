import React, { Component } from 'react';
import $ from 'jquery';
import api from '../api';
import Login from './Login';
import ReactGa from 'react-ga';
import showdown from 'showdown';
import * as Survey from 'survey-react';
import {
  Card,
  Form,
  Accordion,
  ModalBody,
  ModalTitle,
  ModalFooter,
  DropdownButton,
  Modal,
} from 'react-bootstrap';
import { Button } from '@material-ui/core';

import * as widgets from 'surveyjs-widgets';
import { withRouter } from 'react-router-dom';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { ToastContainer, toast } from 'react-toastify';
import { getLoggedInUser } from '../helper/AuthHelper';

import 'react-toastify/dist/ReactToastify.css';
import { AssessmentStepper } from '../Components/AssessmentStepper';

// set up survey styles and properties for rendering html
Survey.StylesManager.applyTheme('bootstrapmaterial');

Survey.defaultBootstrapMaterialCss.progressBar =
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

class AccessToCareAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: {},
      roleFilters: [],
      domainFilters: [],
      regionFilters: [],
      lifecycleFilters: [],
      dimArray: [],
      showModal: false,
      authToken: localStorage.getItem('authToken'),
      submission_id: this?.props?.location?.state?.submission_id,
      user_id: this?.props?.location?.state?.user_id,
      localResponses: JSON.parse(localStorage.getItem('localResponses')),
      currentPageIndex: null,
      userQuestionAnswered: !!this?.props?.location?.state?.userType,
      userAnswer: this?.props?.location?.state?.userType,
      systemAnswer: this?.props?.location?.state?.system ?? [],
      regionAnswer: this?.props?.location?.state?.region || [],
      domainAnswer: this?.props?.location?.state?.domain,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenEmptyModal = this.handleOpenEmptyModal.bind(this);
    this.handleCloseEmptyModal = this.handleCloseEmptyModal.bind(this);
    this.submitUserQuestion = this.submitUserQuestion.bind(this);
    this.updateUserAnswer = this.updateUserAnswer.bind(this);
    this.updateSystemAnswer = this.updateSystemAnswer.bind(this);
    this.updateRegionAnswer = this.updateRegionAnswer.bind(this);
    this.updateDomainAnswer = this.updateDomainAnswer.bind(this);
    this.showAlternateReport = this.showAlternateReport.bind(this);
  }

  // Request questions JSON from backend
  componentDidMount() {
    widgets.nouislider(Survey);

    ReactGa.pageview(window.location.pathname + window.location.search);

    api.get('dimensions/names').then((res) => {
      this.setState({ dimArray: res.data.dimensions });
    });

    api.get('metadata').then((res) => {
      this.setState({ metadata: res.data });
    });

    if (this?.props?.location?.state?.region) {
      this.setState({ regionAnswer: this?.props?.location?.state?.region });
      this.setState({ domainAnswer: this?.props?.location?.state?.domain });
    }

    this.setState({ systemAnswer: this?.props?.location?.state?.system ?? [] });
    if (this?.props?.location?.state?.userType) {
      this.getQuestions();
    }
  }

  componentDidUpdate() {
    // make answeres persistent across page reloads
    if (this.state.model?.data !== undefined) {
      localStorage.setItem(
        'localResponses',
        JSON.stringify(this.state.model?.data)
      );
    }
  }

  // clear local storage before navigating away
  componentWillUnmount() {
    localStorage.removeItem('localResponses');
  }

  updateUserAnswer(value) {
    this.setState({ userAnswer: value });
  }

  updateSystemAnswer(value) {
    let sel = this.state.systemAnswer
    let find = sel.indexOf(value)
    if (find > -1) {
      sel.splice(find, 1)
    } else {
      sel.push(value)
    }

    this.setState({
      systemAnswer: sel,
    })
  }

  updateRegionAnswer(value) {
    let sel = this.state.regionAnswer
    let find = sel.indexOf(value)
    if (find > -1) {
      sel.splice(find, 1)
    } else {
      sel.push(value)
    }

    this.setState({
      regionAnswer: sel,
    })
  }

  updateDomainAnswer(value) {
    this.setState({
      domainAnswer: value,
    })
  }

  submitUserQuestion() {
    if (this.state.systemAnswer) {
      this.getQuestions();
      this.createSubmission();
      this.setState({ userQuestionAnswered: true });
    }
  }

  async createSubmission() {
    if (!this.state.submission_id) {
      api
        .post('submissions', {
          userId: this.state?.user_id,
          submission: {},
          date: new Date(),
          projectName: '',
          completed: false,
          domain: this.state.domainFilters,
          region: this.state.regionFilters,
          domainData: this.state.domainAnswer,
          regionData: this.state.regionAnswer,
          roles: this.state.roleFilters,
          lifecycle: this.state.lifecycleFilters,
        })
        .then((res) => {
          const { _id } = res.data;
          this.setState({ submission_id: _id });
        });
    }
  }

  async getQuestions(submissions) {
    api
      .get('questions', {
        params: {
          roles: this.state.roleFilters,
          domains: this.state.domainFilters,
          regions: this.state.regionFilters,
          lifecycles: this.state.lifecycleFilters,
          userType: this.state.userAnswer,
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
          const node = options.htmlElement.querySelector('h4');
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

  nextPath(path, state) {
    this.props.history.push({
      pathname: path,
      state: {
        questions: this.state.json,
        responses: this.state.model.data,
        submissionId: this.state.submission_id,
        ...state,
      },
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
    // this.state.model.clear();
    this.handleCloseModal();
    this.handleCloseEmptyModal();
    this.props.history.push({ pathname: '/' });
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
      (q) => q?.title?.default === 'Name of AI System' || q?.title?.default === 'Project Name'
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
        userType: this.state?.userAnswer,
        system: this.state?.systemAnswer,
        regionData: this.state?.regionAnswer,
        domainData: this.state?.domainAnswer,
      })
      .then((res) => {
        toast('Saving Responses', {
          toastId: 'saving',
        });
        let submission = res.data;
        if (!this.state.submission_id) {
          this.setState({ submission_id: submission._id });
        }
      });
  }

  /* determine if user should go to be shown the normal results
  page or be shown the pilot repot based on lifecycle
  */
  showAlternateReport() {
    const question = this.state.json?.pages[0]?.elements?.find(
      (q) => q?.title?.default === 'Life Cycle Phase'
    );
    const answer = this.state.model.data[question?.name] ?? '';
    const lifeCycle = question?.choices.find(
      (choice) => choice.value === answer
    )?.text?.default;

    if (['Develop and Deploy', 'Operate', 'Decommission'].includes(lifeCycle)) {
      return true;
    }
    return false;
  }

  finish() {
    this.save(true);
    this.state.model.doComplete();
    const alternateReport = this.showAlternateReport();
    this.nextPath('/Results/', { alternateReport });
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
    const survey = this.state?.model;
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
    return this.state.model || !this.state.userQuestionAnswered ? (
      <div className="surveyContainer">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Login />
        </div>
        {!this.state.userQuestionAnswered ? (
          <div style={{
            padding: '40px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ paddingTop: '20px' }}>
                  What is your system task?
              </p>
                <fieldset id="systemQuestion">
                  <div>
                    <input
                      type="checkbox"
                      value="Recognition"
                      name="systemQuestion"
                      checked={this.state?.systemAnswer?.includes("Recognition")}
                      onChange={(event) =>
                        this.updateSystemAnswer(event.target.value)
                      }
                    />
                    <label for="Recognition" style={{ paddingLeft: '10px' }}>
                      Recognition
                </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Follow up, emotion recognition"
                      name="systemQuestion"
                      checked={this.state?.systemAnswer?.includes("Follow up, emotion recognition")}
                      onChange={(event) =>
                        this.updateSystemAnswer(event.target.value)
                      }
                    />
                    <label for="Follow up, emotion recognition" style={{ paddingLeft: '10px' }}>
                      Follow up, emotion recognition
                </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Event detection"
                      name="systemQuestion"
                      checked={this.state?.systemAnswer?.includes("Event detection")}
                      onChange={(event) =>
                        this.updateSystemAnswer(event.target.value)
                      }
                    />
                    <label for="Event detection" style={{ paddingLeft: '10px' }}>
                      Event detection
                </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Forecasting"
                      name="systemQuestion"
                      checked={this.state?.systemAnswer?.includes("Forecasting")}
                      onChange={(event) =>
                        this.updateSystemAnswer(event.target.value)
                      }
                    />
                    <label for="Forecasting" style={{ paddingLeft: '10px' }}>
                      Forecasting
                </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Personalization"
                      name="systemQuestion"
                      checked={this.state?.systemAnswer?.includes("Personalization")}
                      onChange={(event) =>
                        this.updateSystemAnswer(event.target.value)
                      }
                    />
                    <label for="Personalization" style={{ paddingLeft: '10px' }}>
                      Personalization
                </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Interaction support"
                      name="systemQuestion"
                      checked={this.state?.systemAnswer?.includes("Interaction support")}
                      onChange={(event) =>
                        this.updateSystemAnswer(event.target.value)
                      }
                    />
                    <label for="Interaction support" style={{ paddingLeft: '10px' }}>
                      Interaction support
                </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Goal-driven optimization"
                      name="systemQuestion"
                      checked={this.state?.systemAnswer?.includes("Goal-driven optimization")}
                      onChange={(event) =>
                        this.updateSystemAnswer(event.target.value)
                      }
                    />
                    <label for="Goal-driven optimization" style={{ paddingLeft: '10px' }}>
                      Goal-driven optimization
                </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Reasoning with knowledge structures"
                      name="systemQuestion"
                      checked={this.state?.systemAnswer?.includes("Reasoning with knowledge structures")}
                      onChange={(event) =>
                        this.updateSystemAnswer(event.target.value)
                      }
                    />
                    <label for="Reasoning with knowledge structures" style={{ paddingLeft: '10px' }}>
                      Reasoning with knowledge structures
                </label>
                  </div>
                </fieldset>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ paddingTop: '20px' }}>
                  What region is it operating in?
              </p>
                <fieldset id="regionQuestion">
                  <div>
                    <input
                      type="checkbox"
                      value="US"
                      name="regionQuestion"
                      checked={this.state?.regionAnswer?.includes('US')}
                      onChange={(event) =>
                        this.updateRegionAnswer(event.target.value)
                      }
                    />
                    <label for="US" style={{ paddingLeft: '10px' }}>
                      US
                  </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="UK"
                      name="regionQuestion"
                      checked={this.state?.regionAnswer?.includes('UK')}
                      onChange={(event) =>
                        this.updateRegionAnswer(event.target.value)
                      }
                    />
                    <label for="UK" style={{ paddingLeft: '10px' }}>
                      UK
                  </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="EU"
                      name="regionQuestion"
                      checked={this.state?.regionAnswer?.includes('EU')}
                      onChange={(event) =>
                        this.updateRegionAnswer(event.target.value)
                      }
                    />
                    <label for="EU" style={{ paddingLeft: '10px' }}>
                      EU
                  </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Canada"
                      name="regionQuestion"
                      checked={this.state?.regionAnswer?.includes('Canada')}
                      onChange={(event) =>
                        this.updateRegionAnswer(event.target.value)
                      }
                    />
                    <label for="Canada" style={{ paddingLeft: '10px' }}>
                      Canada
                  </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Other"
                      name="regionQuestion"
                      checked={this.state?.regionAnswer?.includes('Other')}
                      onChange={(event) =>
                        this.updateRegionAnswer(event.target.value)
                      }
                    />
                    <label for="Other" style={{ paddingLeft: '10px' }}>
                      Other
                  </label>
                  </div>
                </fieldset>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ paddingTop: '20px' }}>
                  Which domain is the application for?
              </p>
                <fieldset id="domainQuestion">
                  <div>
                    <input
                      type="radio"
                      value="HR"
                      name="domainQuestion"
                      checked={this.state?.domainAnswer === 'HR'}
                      onChange={(event) =>
                        this.updateDomainAnswer(event.target.value)
                      }
                    />
                    <label for="HR" style={{ paddingLeft: '10px' }}>
                      HR
                  </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="Finance"
                      name="domainQuestion"
                      checked={this.state?.domainAnswer === 'Finance'}
                      onChange={(event) =>
                        this.updateDomainAnswer(event.target.value)
                      }
                    />
                    <label for="Finance" style={{ paddingLeft: '10px' }}>
                      Finance
                  </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="Procurement"
                      name="domainQuestion"
                      checked={this.state?.domainAnswer === 'Procurement'}
                      onChange={(event) =>
                        this.updateDomainAnswer(event.target.value)
                      }
                    />
                    <label for="Procurement" style={{ paddingLeft: '10px' }}>
                      Procurement
                  </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="Health"
                      name="domainQuestion"
                      checked={this.state?.domainAnswer === 'Health'}
                      onChange={(event) =>
                        this.updateDomainAnswer(event.target.value)
                      }
                    />
                    <label for="Health" style={{ paddingLeft: '10px' }}>
                      Health
                  </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="Other"
                      name="domainQuestion"
                      checked={this.state?.domainAnswer === 'Other'}
                      onChange={(event) =>
                        this.updateDomainAnswer(event.target.value)
                      }
                    />
                    <label for="Other" style={{ paddingLeft: '10px' }}>
                      Other
                  </label>
                  </div>
                </fieldset>
              </div>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.submitUserQuestion()}
                style={{ marginTop: '20px' }}
                disabled={
                  !this.state.domainAnswer
                  || this.state.systemAnswer.length === 0
                  || this.state.regionAnswer.length === 0}
              >
                Start Survey
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="dimensionNav">
              <AssessmentStepper
                dimArray={this.state.dimArray}
                pages={this.state.json.pages}
                model={this.state.model}
                onStepClick={this.navPage.bind(this)}
              />
              <Accordion className="questionFilter">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="9">
                    Filters
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="9">
                    <Card.Body className="cardBody">
                      <DropdownButton title="Roles" className="filterDrop">
                        <Form>
                          {this.state.metadata.roles.map((role, index) => {
                            return index + 1 !==
                              this.state.metadata.roles.length ? (
                              <Form.Check
                                type="checkbox"
                                checked={this.state.roleFilters.includes(
                                  index + 1
                                )}
                                label={role.name}
                                id={index}
                                key={index}
                                value={index + 1}
                                onChange={(e) => this.addRole(e.target.value)}
                              />
                            ) : null;
                          })}
                        </Form>
                        <Button
                          id="clearFilter"
                          onClick={() => this.clearFilter('roles')}
                        >
                          <div>
                            Reset <i className="fa fa-undo fa-fw"></i>
                          </div>
                        </Button>
                      </DropdownButton>
                      <DropdownButton title="Industry" className="filterDrop">
                        <Form>
                          {this.state.metadata.domain.map((domain, index) => {
                            return (
                              <Form.Check
                                type="checkbox"
                                checked={this.state.domainFilters.includes(
                                  index + 1
                                )}
                                label={domain.name}
                                id={index}
                                key={index}
                                value={index + 1}
                                onChange={(e) => this.addDomain(e.target.value)}
                              />
                            );
                          })}
                        </Form>
                        <Button
                          id="clearFilter"
                          onClick={() => this.clearFilter('domain')}
                        >
                          <div>
                            Reset <i className="fa fa-undo fa-fw"></i>
                          </div>
                        </Button>
                      </DropdownButton>
                      <DropdownButton title="Regions" className="filterDrop">
                        <Form>
                          {this.state.metadata.region.map((region, index) => {
                            return (
                              <Form.Check
                                type="checkbox"
                                checked={this.state.regionFilters.includes(
                                  index + 1
                                )}
                                label={region.name}
                                id={index}
                                key={index}
                                value={index + 1}
                                onChange={(e) => this.addRegion(e.target.value)}
                              />
                            );
                          })}
                        </Form>
                        <Button
                          id="clearFilter"
                          onClick={() => this.clearFilter('region')}
                        >
                          <div>
                            Reset <i className="fa fa-undo fa-fw"></i>
                          </div>
                        </Button>
                      </DropdownButton>
                      <DropdownButton
                        title="Life Cycles"
                        className="filterDrop"
                      >
                        <Form>
                          {this.state.metadata.lifecycle.map(
                            (lifecycle, index) => {
                              return index + 1 !==
                                this.state.metadata.lifecycle.length ? (
                                <Form.Check
                                  type="checkbox"
                                  checked={this.state.lifecycleFilters.includes(
                                    index + 1
                                  )}
                                  label={lifecycle.name}
                                  id={index}
                                  key={index}
                                  value={index + 1}
                                  onChange={(e) =>
                                    this.addLifecycle(e.target.value)
                                  }
                                />
                              ) : null;
                            }
                          )}
                        </Form>
                        <Button
                          id="clearFilter"
                          onClick={() => this.clearFilter('lifecycle')}
                        >
                          <div>
                            Reset <i className="fa fa-undo fa-fw"></i>
                          </div>
                        </Button>
                      </DropdownButton>
                      <Button
                        id="saveButton"
                        className="filterApply"
                        onClick={() => this.applyFilters()}
                      >
                        Apply Filters
                      </Button>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
            {this.state.mount ? (
              <div className="surveyQuestionContainer">
                <Survey.Survey
                  model={this.state.model}
                  onComplete={this.onComplete}
                />
              </div>
            ) : null}
          </div>
        )}
        {this.state.userQuestionAnswered && this.state.model && (
          <div id="navCon" className="container">
            <div id="navCard" className="card">
              <div className="row no-gutters">
                <div className="d-flex justify-content-start col">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleOpenModal}
                  >
                    Reset
                  </Button>
                </div>
                <div className="d-flex justify-content-center col">
                  <Button
                    variant="contained"
                    color="primary"
                    className="mr-2"
                    onClick={() => this.prevPage()}
                    disabled={this.state.model.isFirstPage}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mr-2"
                    onClick={() => this.nextPage()}
                    disabled={this.state.model.isLastPage}
                  >
                    Next
                  </Button>
                </div>
                <div className="d-flex justify-content-end col">
                  <Button
                    variant="contained"
                    color="primary"
                    className="mr-2"
                    onClick={() => this.save()}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mr-2"
                    onClick={() => this.finish()}
                  >
                    Finish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
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
            <Button
              variant="outlined"
              color="primary"
              className="mr-2"
              onClick={this.handleCloseModal}
            >
              No
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.resetSurvey()}
            >
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

export default withRouter(AccessToCareAssessment);
