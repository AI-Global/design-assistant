import $ from "jquery";
import axios from 'axios';
import Login from './Login';
import ReactGa from 'react-ga';
import showdown from 'showdown';
import * as Survey from "survey-react";
import Card from 'react-bootstrap/Card';
import { Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import * as widgets from "surveyjs-widgets";
import { withRouter } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// set up survey styles and properties for rendering html
Survey
  .StylesManager
  .applyTheme("bootstrapmaterial")

Survey
  .defaultBootstrapMaterialCss
  .progressBar = "progress-bar bg-custom progress-bar-striped";

Survey
  .Serializer
  .addProperty("page", {
    name: "navigationTitle:string",
    isLocalizable: true
  });

Survey
  .Serializer
  .addProperty("question", "alttext:text");

// remove localization strings for progress bar
// https://surveyjs.answerdesk.io/ticket/details/t2551/display-progress-bar-without-text
// Asked by: MDE | Answered by: Andrew Telnov
var localizedStrs = Survey.surveyLocalization.locales[Survey.surveyLocalization.defaultLocale];
localizedStrs.progressText = "";

// array of dimension names used to create navigation cards


class DesignAssistantSurvey extends Component {

  constructor(props) {
    super(props);
    this.state = {
      metadata: {},
      roleFilters: [13],
      domainFilters: [],
      regionFilters: [],
      lifecycleFilters: [6],
      dimArray: [],
      showModal: false,
      //TODO: Change these from being hardcoded 
      A: 1,
      B: 9,
      E: 19,
      R: 25,
      D: 28,
      authToken: localStorage.getItem("authToken"),
      submission_id: this?.props?.location?.state?.submission_id,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  // Request questions JSON from backend 
  componentDidMount() {
    widgets.bootstrapslider(Survey);

    ReactGa.pageview(window.location.pathname + window.location.search);

    axios.get(process.env.REACT_APP_SERVER_ADDR + '/dimensions/names').then((res) => {
      this.setState({ dimArray: res.data.dimensions });
    });

    var endPoint = '/metadata';
    axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
      .then(res => {
        this.setState({ metadata: res.data })
      })
    this.getQuestions()
  }

  async getQuestions(submissions) {
    var endPoint = '/questions';
    axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint, { params: { roles: this.state.roleFilters, domains: this.state.domainFilters, regions: this.state.regionFilters, lifecycles: this.state.lifecycleFilters } })
      .then(res => {
        this.setState({ mount: false })
        var json = res.data;
        // replace double escaped characters so showdown correctly renders markdown frontslashes and newlines
        var stringified = JSON.stringify(json);
        stringified = stringified.replace(/\\\\n/g, "\\n");
        stringified = stringified.replace(/\\\//g, "/");
        json = JSON.parse(stringified);

        const model = new Survey.Model(json);
        const converter = new showdown.Converter();
        // Set json and model
        this.setState({ json: json });
        this.setState({ model });

        if (this?.props?.location?.state?.prevResponses) {
          model.data = this.props.location.state.prevResponses
        }

        if (this?.props?.location?.state?.filters && !submissions) {
          this.setState({ roleFilters: this.props.location.state.filters.roles })
          this.setState({ domainFilters: this.props.location.state.filters.domain })
          this.setState({ regionFilters: this.props.location.state.filters.region })
          this.setState({ lifecycleFilters: this.props.location.state.filters.lifecycle })
        }

        if (submissions) {
          model.data = submissions
        }

        model
          .onTextMarkdown
          .add(function (model, options) {
            var str = converter.makeHtml(options.text)
            options.html = str;
          })

        // add tooltip
        model
          .onAfterRenderPage
          .add(function (model, options) {
            const node = options.htmlElement.querySelector("h4");
            if (node) {
              node.classList.add('section-header');
            }
            // wait to load jquery to fix testing bug
            // https://stackoverflow.com/a/63217419
            setTimeout(function () {
              $('[data-toggle="tooltip"]').tooltip({
                boundary: 'viewport'
              });
            }, 2000)
          });
        //change labels to 'h5' to bold them
        model
          .onAfterRenderQuestion
          .add(function (model, options) {
            let title = options.htmlElement.querySelector("h5");
            if (title) {
              // add tooltip for question if alttext has default value
              let altTextHTML = "";
              if (options.question.alttext && options.question.alttext.hasOwnProperty("default")) {
                let altText = converter.makeHtml(options.question.alttext.default.replace(/"/g, "&quot;"));
                altText = `<div class="text-justify">${altText}</div>`.replace(/"/g, "&quot;");
                altTextHTML = `<i class="fas fa-info-circle ml-2" data-toggle="tooltip" data-html="true" title="${altText}"></i>`;
              }
              title.outerHTML =
                '<label for="' +
                options.question.inputId +
                '" class="' +
                title.className +
                '"><span class="field-name">' +
                title.innerText +
                "</span>" +
                altTextHTML +
                "</label>";
              // add tooltip for answers if alttext has default value
              options.htmlElement.querySelectorAll("input").forEach((element) => {
                if (options.question.alttext && options.question.alttext.hasOwnProperty(element.value)) {
                  const div = element.closest("div");
                  div.classList.add("d-flex");
                  const i = document.createElement("span");
                  let altText = converter.makeHtml(options.question.alttext[element.value].default.replace(/"/g, "&quot;"));
                  altText = `<div class="text-justify">${altText}</div>`.replace(/"/g, "&quot;");
                  i.innerHTML = `<i class="fas fa-info-circle ml-2" data-toggle="tooltip" data-html="true" title="${altText}"></i>`;
                  div.appendChild(i);
                }
              });
            }
          });
        this.setState({ mount: true })
      })
  }

  nextPath(path) {
    this.props.history.push({
      pathname: path,
      state: { questions: this.state.json, responses: this.state.model.data }
    })
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  percent() {
    return this.state.model.getProgress();
  }

  resetSurvey() {
    // do we need to delete submission object here?
    // because we would need to call the database here
    this.state.model.clear()
    this.handleCloseModal()
    window.location.pathname = '/'
  }

  prevPage() {
    this.state.model.prevPage();
    this.setState(this.state)   // force re-render to update buttons and % complete
  }

  nextPage() {
    this.state.model.nextPage();
    this.setState(this.state)   // force re-render to update buttons and % complete
  }

  save(completed = false) {
    // when we click save, we should already have a model saved to the database
    // i.e. the index will always point to a valid submission
    // so just make an update call

    let title = this.state.json?.pages[0]?.elements?.find(q => q?.title?.default === "Title of project");
    let dateTime = new Date();
    let projectName = this.state.model.data[title?.name] ?? "";
    axios.post(process.env.REACT_APP_SERVER_ADDR + '/submissions/update/' + this.state.submission_id, {
      submission: this.state.model.data,
      date: dateTime,
      projectName: projectName,
      completed: completed,
      domain: this.state.domainFilters,
      region: this.state.regionFilters,
      roles: this.state.roleFilters,
      lifecycle: this.state.lifecycleFilters
    }).then(res => {
      console.log(res.data)
      toast("Saving Responses", {
        toastId:"saving"
      });
    });
  }

  finish() {
    this.save(true);
    this.state.model.doComplete();
    this.nextPath('/Results/');
  }

  onComplete(survey, options) {
    console.log("Survey results: " + JSON.stringify(survey.data));
  }

  navDim(dimension) {
    const survey = this.state.model
    switch (dimension) {
      case 0:
        survey.currentPage = survey.pages[this.state.A]
        break;
      case 1:
        survey.currentPage = survey.pages[this.state.B]
        break;
      case 2:
        survey.currentPage = survey.pages[this.state.E]
        break;
      case 3:
        survey.currentPage = survey.pages[this.state.R]
        break;
      case 4:
        survey.currentPage = survey.pages[this.state.D]
        break;
      default:
        survey.currentPage = survey.pages[0]
    }
    this.setState(this.state)
  }

  addRole(e) {
    const v = parseInt(e)
    if (this.state.roleFilters.includes(v)) {
      const i = this.state.roleFilters.indexOf(v)
      this.state.roleFilters.splice(i, 1)
    }
    else { this.state.roleFilters.push(v) }
    this.setState({ roleFilters: this.state.roleFilters })
  }

  addDomain(e) {
    const v = parseInt(e)
    if (this.state.domainFilters.includes(v)) {
      const i = this.state.domainFilters.indexOf(v)
      this.state.domainFilters.splice(i, 1)
    }
    else { this.state.domainFilters.push(v) }
    this.setState({ domainFilters: this.state.domainFilters })
  }

  addRegion(e) {
    const v = parseInt(e)
    if (this.state.regionFilters.includes(v)) {
      const i = this.state.regionFilters.indexOf(v)
      this.state.regionFilters.splice(i, 1)
    }
    else { this.state.regionFilters.push(v) }
    this.setState({ regionFilters: this.state.regionFilters })
  }

  addLifecycle(e) {
    const v = parseInt(e)
    if (this.state.lifecycleFilters.includes(v)) {
      const i = this.state.lifecycleFilters.indexOf(v)
      this.state.lifecycleFilters.splice(i, 1)
    }
    else { this.state.lifecycleFilters.push(v) }
    this.setState({ lifecycleFilters: this.state.lifecycleFilters })
  }

  applyFilters() {
    var submissions = this.state.model.data
    this.getQuestions(submissions)
  }

  navPage(pageNumber) {
    const survey = this.state.model
    survey.currentPage = survey.pages[pageNumber]
    this.setState(this.state)
  }

  shouldDisplayNav(child) {
    let visibleIf = child.visibleIf;
    var parId = visibleIf.split("{")[1].split("}")[0];
    var resId = visibleIf.split("'")[1].split("'")[0];

    if (this.state?.model?.data[parId]) {
      if (Array.isArray(this.state.model.data[parId])) {
        if (this.state.model.data[parId].contains(resId)) {
          return true;
        }
      } else {
        if (this.state.model.data[parId] === resId) {
          return true;
        }
      }
    }
    return false;
  }

  clearFilter(filter) {
    switch (filter) {
      case 'roles':
        this.setState({ roleFilters: [13] })
        break
      case 'domain':
        this.setState({ domainFilters: [] })
        break
      case 'region':
        this.setState({ regionFilters: [] })
        break
      case 'lifecycle':
        this.setState({ lifecycleFilters: [6] })
        break
      default:
        console.log('not a valid filter')
    }
  }


  render() {
    const notifySave = () => toast("Saving Responses");
    var number = 1
    return (
      this.state.model ?
        <div>
          <div className="dimensionNav">
            <Accordion>
              {this.state.dimArray.map((dimension, index) => {
                return (
                  <Card key={index}>
                    <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                      {dimension}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index + 1}>
                      <Card.Body>
                        {this?.state?.json?.pages?.map((page, index) => {
                          return (page.name.includes(dimension.substring(0, 4)) ? page.elements.map((question, i) => {
                            return ((question.type !== "comment" && (!question.visibleIf || this.shouldDisplayNav(question))) ?
                              <Button style={{ margin: "0.75em" }} key={i} id={this.state.model.data[question.name] ? "answered" : "unanswered"} onClick={() => this.navPage(index)}>{number++}</Button>
                              : null)
                          })
                            : null)
                        })
                        }
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>)
              })}
            </Accordion>
            <Accordion className="questionFilter">
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey='9'>
                  Filters
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='9'>
                  <Card.Body className="cardBody">
                    <DropdownButton title="Roles" className="filterDrop">
                      <Form>
                        {this.state.metadata.roles.map((role, index) => {
                          return (index + 1 !== this.state.metadata.roles.length ?
                            <Form.Check type='checkbox' checked={this.state.roleFilters.includes(index + 1)} label={role.name} id={index} key={index} value={index + 1} onChange={(e) => this.addRole(e.target.value)} />
                            : null)
                        })}
                      </Form>
                      <Button id="clearFilter" onClick={() => this.clearFilter('roles')}><div>Reset <i className="fa fa-undo fa-fw"></i></div></Button>
                    </DropdownButton>
                    <DropdownButton title="Industry" className="filterDrop">
                      <Form>
                        {this.state.metadata.domain.map((domain, index) => {
                          return (
                            <Form.Check type='checkbox' checked={this.state.domainFilters.includes(index + 1)} label={domain.name} id={index} key={index} value={index + 1} onChange={(e) => this.addDomain(e.target.value)} />
                          )
                        })}
                      </Form>
                      <Button id="clearFilter" onClick={() => this.clearFilter('domain')}><div>Reset <i className="fa fa-undo fa-fw"></i></div></Button>
                    </DropdownButton>
                    <DropdownButton title="Regions" className="filterDrop">
                      <Form>
                        {this.state.metadata.region.map((region, index) => {
                          return (
                            <Form.Check type='checkbox' checked={this.state.regionFilters.includes(index + 1)} label={region.name} id={index} key={index} value={index + 1} onChange={(e) => this.addRegion(e.target.value)} />
                          )
                        })}
                      </Form>
                      <Button id="clearFilter" onClick={() => this.clearFilter('region')}><div>Reset <i className="fa fa-undo fa-fw"></i></div></Button>
                    </DropdownButton>
                    <DropdownButton title="Life Cycles" className="filterDrop">
                      <Form>
                        {this.state.metadata.lifecycle.map((lifecycle, index) => {
                          return (index + 1 !== this.state.metadata.lifecycle.length ?
                            <Form.Check type='checkbox' checked={this.state.lifecycleFilters.includes(index + 1)} label={lifecycle.name} id={index} key={index} value={index + 1} onChange={(e) => this.addLifecycle(e.target.value)} />
                            : null)
                        })}
                      </Form>
                      <Button id="clearFilter" onClick={() => this.clearFilter('lifecycle')}><div>Reset <i className="fa fa-undo fa-fw"></i></div></Button>
                    </DropdownButton>
                    <Button id="saveButton" className="filterApply" onClick={() => this.applyFilters()}>Apply Filters</Button>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
          <div className="container" style={{ "paddingTop": "2em" }}>
            <div className="d-flex justify-content-center col">{this.percent()}%</div>
          </div>
          {this.state.mount ? <Survey.Survey model={this.state.model} onComplete={this.onComplete} /> : null}
          <div id="navCon" className="container">
            <div id="navCard" className="card">
              <div className="row no-gutters">
                <div className="d-flex justify-content-start col">
                  <Button id='resetButton' className="btn btn-primary mr-2" onClick={this.handleOpenModal}>Reset</Button>
                </div>
                <div className="d-flex justify-content-center col">
                  <Button id='surveyNav' className="btn btn-primary mr-2" onClick={() => this.prevPage()} disabled={this.state.model.isFirstPage}>Prev</Button>
                  <Button id='surveyNav' className="btn btn-primary mr-2" onClick={() => this.nextPage()} disabled={this.state.model.isLastPage}>Next</Button>
                </div>
                <div className="d-flex justify-content-end col">
                  <Button className="btn btn-save mr-2" id="saveButton" onClick={() => this.save()}>Save</Button>
                  <Button className="bt btn-primary" onClick={() => this.finish()}>Finish</Button>
                </div>
              </div>
            </div>
          </div>
          <Modal
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.showModal}>
            <ModalHeader>
              <ModalTitle id="contained-modal-title-vcenter">
                Please Confirm
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>Please confirm that you want to reset everything and start over.</p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleCloseModal}>No</Button>
              <Button id="resetButton" onClick={() => this.resetSurvey()}>Yes</Button>
            </ModalFooter>
          </Modal>
          <Modal
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.showProjectModal}>
            <ModalHeader closeButton>
              <ModalTitle id="contained-modal-title-vcenter">
                Project Title
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>Please enter the name of your project.</p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleCloseProjectModal}>No</Button>
              <Button id="resetButton" onClick={() => this.resetSurvey()}>Yes</Button>
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
        : null
    )
  }
}

export default withRouter(DesignAssistantSurvey);