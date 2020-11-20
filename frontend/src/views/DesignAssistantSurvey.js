import $ from "jquery";
import axios from 'axios';
import Login from './Login';
import ReactGa from 'react-ga';
import showdown from 'showdown';
import * as Survey from "survey-react";
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import * as widgets from "surveyjs-widgets";
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Accordion from 'react-bootstrap/Accordion';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import DropdownButton from 'react-bootstrap/DropdownButton';

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
      dimArray: [],
      showModal: false,
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

    axios.get(process.env.REACT_APP_SERVER_ADDR +'/dimensions/names').then((res) => {
      this.setState({dimArray: res.data});
    });

    var endPoint = '/questions';
    axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
      .then(res => {
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

        // Set survey responses to survey model
        if (this?.props?.location?.state?.prevResponses) {
          model.data = this.props.location.state.prevResponses;
          let questionsAnswered = Object.keys(model.data);
          let lastQuestionAnswered = questionsAnswered[questionsAnswered.length-1];
          let lastPageAnswered = model.pages.find(page => page.elements.find(question => question.name == lastQuestionAnswered));
          model.currentPageNo = lastPageAnswered?.visibleIndex ?? 0;
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
            setTimeout(function() {$('[data-toggle="tooltip"]').tooltip({
              boundary: 'viewport'
            });}, 1500)
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
    // console.log(this.state.model.data, dateTime, projectName, completed)
    axios.post(process.env.REACT_APP_SERVER_ADDR + '/submissions/update/' + this.state.submission_id, {
      submission: this.state.model.data,
      date: dateTime,
      projectName: projectName,
      completed: completed
    }).then(res => console.log(res.data));
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

  render() {
    console.log('render')
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
                      <Card.Body><Button aria-label={dimension} onClick={() => this.navDim(index)}>Nav to {dimension}</Button></Card.Body>
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
                    <DropdownButton title="Role" className="filterDrop" style={{ "marginRight": "1em" }}>
                      <Dropdown.Item>Role 1</Dropdown.Item>
                      <Dropdown.Item>Role 2</Dropdown.Item>
                      <Dropdown.Item>Role 3</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton title="Cycle" className="filterDrop">
                      <Dropdown.Item>Life Cycle 1</Dropdown.Item>
                      <Dropdown.Item>Life Cycle 2</Dropdown.Item>
                      <Dropdown.Item>Life Cycle 3</Dropdown.Item>
                    </DropdownButton>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
          <div className="container" style={{ "paddingTop": "2em" }}>
            <div className="d-flex justify-content-center col">{this.percent()}%</div>
          </div>
          {this.state.mount ? <Survey.Survey model={this.state.model} onComplete={this.onComplete} /> : null }
          <div id="navCon" className="container">
            <div id="navCard" className="card">
              <div className="row no-gutters">
                <div className="d-flex justify-content-start col">
                  <Button className="btn btn-primary mr-2" onClick={this.handleOpenModal}>Reset</Button>
                </div>
                <div className="d-flex justify-content-center col">
                  <Button className="btn btn-primary mr-2" onClick={() => this.prevPage()} disabled={this.state.model.isFirstPage}>Prev</Button>
                  <Button className="btn btn-primary mr-2" onClick={() => this.nextPage()} disabled={this.state.model.isLastPage}>Next</Button>
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
        </div>
        : null
    )
  }
}

export default withRouter(DesignAssistantSurvey);