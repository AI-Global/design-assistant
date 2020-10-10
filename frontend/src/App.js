import * as Survey from "survey-react";
import { Button } from 'react-bootstrap';
import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';

import styles from './App.module.css';
import './css/theme.css';
import './css/survey.css';
import "font-awesome/css/font-awesome.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

const json = require('./survey-enrf.json')
const model = new Survey.Model(json)

// remove licalization strings for progress bar
// https://surveyjs.answerdesk.io/ticket/details/t2551/display-progress-bar-without-text
// Asked by: MDE | Answered by: Andrew Telnov
var localizedStrs = Survey.surveyLocalization.locales[Survey.surveyLocalization.defaultLocale];
localizedStrs.progressText = "";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSurveyStarted: false,
      showModal: false,
      questions: json
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  nextPath(path) {
    this.props.history.push(path, json);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  perc() {
    return model.getProgress();
  }

  resetSurvey() {
    model.clear()
    this.handleCloseModal()
    this.setState({ isSurveyStarted: false })
  }

  prevPage() {
    model.prevPage();
    this.setState(this.state)   // force re-render to update buttons and % complete
  }

  nextPage() {
    model.nextPage();
    this.setState(this.state)   // force re-render to update buttons and % complete
  }

  save() {
    console.log('SAVE SURVEY');
  }

  finish() {
    model.doComplete();
    this.nextPath('/Results/');
  }

  onComplete(survey, options) {
    console.log("Survey results: " + JSON.stringify(survey.data));
  }

  startSurvey() {
    model.clear()      // clear survey to fix restart bug
    this.setState({ isSurveyStarted: true })
  }

  render() {
    if (this.state.isSurveyStarted) {
      return (
        <div>
          <div className={styles.dimContainer}>
            <div className={styles.dimCard}>
              <div className="d-flex justify-content-left col" style={{ float: "left" }}>
                <ul>
                  <div className="d-flex justify-content-center col">
                    <li className={styles.dimButton}>
                      <p className={styles.dimTitle}>Accountability</p>
                    </li>
                  </div>
                  <div className="d-flex justify-content-center col">
                    <li className={styles.dimButton}>
                      <p className={styles.dimTitle}>Bias and Fairness</p>
                    </li>
                  </div>
                  <div className="d-flex justify-content-center col">
                    <li className={styles.dimButton}>
                      <p className={styles.dimTitle} style={{ top: "-1.5em" }}>Explainability and <br></br> Interpretability</p>
                    </li>
                  </div>
                  <div className="d-flex justify-content-center col">
                    <li className={styles.dimButton}>
                      <p className={styles.dimTitle}>Robustness</p>
                    </li>
                  </div>
                  <div className="d-flex justify-content-center col">
                    <li className={styles.dimButton}>
                      <p className={styles.dimTitle}>Bias and Fairness</p>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="d-flex justify-content-center col">{this.perc()}%</div>
          </div>
          <Survey.Survey model={model} onComplete={this.onComplete} />
          <div id="navCon" className="container">
            <div id="navCard" className="card">
              <div className="row no-gutters">
                <div className="d-flex justify-content-start col">
                  <Button className="btn btn-primary mr-2" onClick={this.handleOpenModal}>Reset</Button>
                </div>
                <div className="d-flex justify-content-center col">
                  <Button className="btn btn-primary mr-2" onClick={() => this.prevPage()} disabled={model.isFirstPage}>Prev</Button>
                  <Button className="btn btn-primary mr-2" onClick={() => this.nextPage()} disabled={model.isLastPage}>Next</Button>
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
            <ModalHeader closeButton>
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
        </div>
      );
    } else {
      return (
        <div>
          <h1 className="section-header">Welcome</h1>
          <div style={{ padding: "1em" }}>
            <p>Welcome‌ ‌to‌ ‌the‌ ‌Responsible‌ ‌Design‌ ‌Assistant‌ ‌beta.‌ ‌This‌ ‌is‌ ‌a‌ ‌virtual‌ ‌guide‌ ‌to‌ ‌help‌ ‌those‌ designing,‌ ‌developing,‌ ‌and‌ ‌implementing‌ ‌AI‌ ‌systems‌ ‌do‌ ‌so‌ ‌in‌ ‌a‌ ‌responsible‌ ‌way.‌</p>
            <p>Committed‌ ‌to‌ ‌making‌ ‌responsible‌ ‌AI‌ ‌systems,‌ ‌we’ve‌ ‌done‌ ‌the‌ ‌hard‌ ‌work‌ ‌of‌ ‌deciphering‌ the‌ ‌best‌ ‌practices,‌ ‌policies,‌ ‌and‌ ‌principles‌ ‌and‌ ‌put‌ ‌them‌ ‌into‌ ‌a‌ ‌simple‌ ‌online‌ ‌survey.‌</p>
            <p>With‌ ‌our‌ ‌esteemed‌ ‌community‌ ‌of‌ ‌subject‌ ‌matter‌ ‌experts‌ ‌ranging‌ ‌from‌ ‌engineers,‌ ‌to‌ ethicists,‌ ‌to‌ ‌policy‌ ‌makers,‌ ‌we‌ ‌have‌ ‌taken‌ ‌the‌ ‌most‌ ‌cited‌ ‌principles,‌ ‌whitepapers,‌ ‌and‌ policy‌ ‌documents‌ ‌published‌ ‌by‌ ‌academics,‌ ‌standards‌ ‌organizations,‌ ‌and‌ ‌companies‌ and‌ ‌translated‌ ‌them‌ ‌into‌ ‌comprehensive‌ ‌questions.‌</p>
            <p>Based‌ ‌on‌ ‌our‌ ‌research‌ ‌and‌ ‌experience‌ ‌we‌ ‌have‌ ‌created‌ ‌a‌ ‌comprehensive‌ ‌evaluation‌ looking‌ ‌at‌ ‌the‌ ‌following‌ ‌dimensions‌ ‌of‌ ‌a‌ ‌trusted‌ ‌AI‌ ‌program:‌</p>
            <ol style={{ "fontWeight": "bold" }}>
              <li>Accountability</li>
              <li>Explainability and Interpretability</li>
              <li>Data Quality</li>
              <li>Bias and Fairness</li>
              <li>Robustness</li>
            </ol>
            <p>Our‌ ‌hope‌ ‌is‌ ‌that‌ ‌you‌ ‌will‌ ‌work‌ ‌with‌ ‌your‌ ‌colleagues‌ ‌who‌ ‌are‌ ‌responsible‌ ‌for‌ ‌different‌ aspects‌ ‌of‌ ‌your‌ ‌business‌ ‌to‌ ‌fill‌ ‌out‌ ‌the‌ ‌Design‌ ‌Assistant.‌ ‌Whether‌ ‌you‌ ‌are‌ ‌just‌ ‌thinking‌ about‌ ‌how‌ ‌to‌ ‌integrate‌ ‌AI‌ ‌tools‌ ‌into‌ ‌your‌ ‌business,‌ ‌or‌ ‌you‌ ‌have‌ ‌already‌ ‌deployed‌ several‌ ‌models,‌ ‌this‌ ‌tool‌ ‌is‌ ‌for‌ ‌you.‌ ‌We‌ ‌do‌ ‌think‌ ‌that‌ ‌these‌ ‌questions‌ ‌are‌ ‌best‌ ‌to‌ ‌think‌ about‌ ‌at‌ ‌the‌ ‌start‌ ‌of‌ ‌your‌ ‌project,‌ ‌however,‌ ‌we‌ ‌do‌ ‌think‌ ‌that‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌can‌ ‌be‌ used‌ ‌throughout‌ ‌the‌ ‌lifecycle‌ ‌of‌ ‌your‌ ‌project!‌</p>
            <p>To‌ ‌learn‌ ‌more‌ ‌about‌ ‌the‌ ‌background‌ ‌of‌ ‌this‌ ‌project,‌ ‌check‌ ‌out‌ ‌our‌ ‌post‌ ‌about‌ ‌the‌ creation‌ ‌of‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌on‌ <a target="_blank" rel="noopener noreferrer" href="https://ai-global.org/2020/04/28/creating-a-responsible-ai-trust-index-a-unified-assessment-to-assure-the-responsible-design-development-and-deployment-of-ai/">ai-global.org</a>‌‌</p>
            <p>For‌ ‌more‌ ‌information‌ ‌on‌ ‌how‌ ‌to‌ ‌use‌ ‌the‌ ‌Design‌ ‌Assistant,‌ ‌including‌ ‌FAQ’s,‌ ‌check‌ ‌out‌ our <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/presentation/d/1EDPhyRhIsiOrujLcHQv_fezXfgOz4Rl7a8lyOM_guoA/edit#slide=id.p1">Guide</a></p>
          </div>
          <div className="row" style={{ padding: "25px" }}>
            <div className="col-sm-6">
              <div className="card h-100">
                <div className="card-header">Design assistant</div>
                <div className="card-body d-flex justify-content-center h-100">
                  <div>
                    <Button onClick={() => this.startSurvey()}>Start measuring your AI Trust Index now!</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card h-100">
                <div className="card-header">Continue existing survey</div>
                <div className="card-body d-flex justify-content-center h-100">
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default withRouter(App);

