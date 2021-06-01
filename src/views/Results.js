import React, { Component } from 'react';
import api from '../api';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import {
  Tabs,
  Tab,
  Table,
  Button,
  Nav,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import '../css/results.css';
// import { ResponsiveRadar } from '@nivo/radar';
import exportReport from '../helper/ExportReport';
import ReportCard from './ReportCard';
//Table no longer being used for certification report card
// import DimensionScore from './DimensionScore';
import TrustedAIProviders from './TrustedAIProviders';
import TrustedAIResources from './TrustedAIResources';
import ReactGa from 'react-ga';
import Login from './Login';
import QuestionScore from '../helper/QuestionScore';
import Badge from '../media/certification.png';

ReactGa.initialize(process.env.REACT_APP_GAID, {
  testMode: process.env.NODE_ENV !== 'production',
});

const StartAgainHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'Clicked the Start Again button from the Results page',
  });
};

const ExportHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'Exported report as PDF',
  });
};

function LevelBar(props) {
  let paddingBottom = props.show ? '60px' : '75px';
  return (
    <>
      {props.show && (
        <div className="row" style={{ justifyContent: 'center' }}>
          <div className="levels-name">{props.title[0]}</div>
          <div className="levels-name">{props.title[1]}</div>
          <div className="levels-name">{props.title[2]}</div>
        </div>
      )}
      <div
        className="row"
        style={{ justifyContent: 'center', marginBottom: paddingBottom }}
      >
        <div className="rectangle-black" />
        <div className="rectangle-black" />
        <div className="rectangle-grey" />
      </div>
    </>
  );
}

function ScoreLevelBar(props) {
  let paddingBottom = props.show ? '60px' : '75px';
  return (
    <div className="row">
      <div className="col">
        {props.name}
        <br />
        {props.definition}
        <br />
        <br />
      </div>
      <div className="col">
        {props.show && (
          <div className="row" style={{ justifyContent: 'center' }}>
            <div className="levels-name">{props.title[0]}</div>
            <div className="levels-name">{props.title[1]}</div>
            <div className="levels-name">{props.title[2]}</div>
          </div>
        )}
        <div
          className="row"
          style={{ justifyContent: 'center', marginBottom: paddingBottom }}
        >
          <div className="rectangle-black" />
          <div className="rectangle-black" />
          <div className="rectangle-grey" />
        </div>
      </div>
    </div>
  );
}
/**
 * Component processes the answers to the survey and
 * renders the results to the user in various different ways.
 */
export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Dimensions: [],
      SubDimensions: [],
      Settings: [],
    };
  }

  componentDidMount() {
    ReactGa.pageview(window.location.pathname + window.location.search);
    api.get('dimensions').then((res) => {
      this.setState({ Dimensions: res.data });
    });

    api.get('subdimensions').then((res) => {
      this.setState({ SubDimensions: res.data });
    });
    api.get('settings').then((res) => {
      this.setState({ Settings: res.data });
    });
  }

  calculateRiskWeight(riskQuestions, results) {
    var riskScore = 0;
    var maxRiskScore = 0;
    // Calculate total risk based off user responses
    riskQuestions.map((question) => {
      let selectedChoices = results[question.name];
      let questionScore = QuestionScore.calculateQuestionScore(
        question,
        selectedChoices,
        1
      );
      riskScore += questionScore.score;
      maxRiskScore += questionScore.maxScore;

      return maxRiskScore;
    });

    return riskScore;
  }

  downloadCSV(results, questionsObj) {
    // stores our responses, faster than a string
    var contentArr = [];

    // push headers into the csv
    contentArr.push('Question,Response,Recommendation,Comments\n');

    // iterate through all questions that user has answered
    for (let i = 0; i < questionsObj.length; ++i) {
      var question = questionsObj[i];

      // csv format: 3 columns
      // question, response, recommendation

      // user responses here
      var user_response_ids;

      // the
      let response = results[question.name];

      // If there are more than one response, filter
      if (Array.isArray(response)) {
        user_response_ids = question?.choices?.filter((choice) =>
          response?.includes(choice?.value)
        );
      } else {
        user_response_ids = question?.choices?.filter(
          (choice) => response === choice?.value
        );
      }

      // if we have any responses left
      if (user_response_ids) {
        var questionText = question?.title?.default;
        var questionResponse = '';
        var questionRecommendation = question?.recommendation?.default;
        let comments = results['other' + question.name];
        for (let j = 0; j < user_response_ids.length; ++j) {
          if (j != 0) {
            questionResponse += ', ';
          }
          questionResponse += user_response_ids[j]?.text?.default;
          // we need to check that the field exists, and if it does,
          // replace quotes with double quotes, and surround with quotes
          // this will make the string csv safe
          // if no field, append nothing, a column will still populate
        }
        if (questionText) {
          contentArr.push('"' + questionText.replaceAll('"', '""') + '"');
        }
        contentArr.push(',');
        if (questionResponse) {
          contentArr.push('"' + questionResponse.replaceAll('"', '""') + '"');
        }
        contentArr.push(',');
        if (questionRecommendation) {
          contentArr.push(
            '"' + questionRecommendation.replaceAll('"', '""') + '"'
          );
        } else {
          contentArr.push(',');
        }
        if (comments) {
          contentArr.push('"' + comments.replaceAll('"', '""') + '"');
        }
        contentArr.push('\n');
      }
    }

    var filename = 'ReportCard.csv';
    var blob = new Blob([contentArr.join('')], {
      type: 'text/plain;charset=utf-8',
    });

    // save to client!
    saveAs(blob, filename);
  }

  render() {
    var json = this?.props?.location?.state?.questions;
    var surveyResults = this?.props?.location?.state?.responses;
    if (json === undefined || surveyResults === undefined) {
      this.props.history.push({
        pathname: '/',
      });
      return null;
    }
    var pages = json['pages'];
    var allQuestions = [];
    pages.map((page) => {
      allQuestions = allQuestions.concat(page?.elements);
      return allQuestions;
    });

    var riskWeight = this.calculateRiskWeight(allQuestions, surveyResults);

    // Calculate risk/mitigation for each subdimension
    let subdimensionScores = {};

    this.state.SubDimensions.map((subDimension) => {
      subdimensionScores[subDimension.subDimensionID] =
        QuestionScore.calculateSubdimensionScore(
          allQuestions,
          surveyResults,
          subDimension
        );
      // Scale down risk and mitigation scores if it goes beyond the maximum
      if (
        subdimensionScores[subDimension.subDimensionID].riskScore >
        subDimension.maxRisk
      ) {
        subdimensionScores[subDimension.subDimensionID].riskScore =
          subDimension.maxRisk;
      }

      if (
        subdimensionScores[subDimension.subDimensionID].mitigationScore >
        subDimension.maxmitigation
      ) {
        subdimensionScores[subDimension.subDimensionID].mitigationScore =
          subDimension.maxmitigation;
      }
    });

    let dimensionScores = {};
    let totalRiskScore = 0;
    let totalMitigationScore = 0;
    let totalOrganizationScore = 0;
    // Calculate total risk/mitigation for each dimension
    for (let key in subdimensionScores) {
      let sd = subdimensionScores[key];
      if (sd.dimensionID in dimensionScores) {
        dimensionScores[sd.dimensionID].riskScore += sd.riskScore;
        dimensionScores[sd.dimensionID].mitigationScore += sd.mitigationScore;
      } else {
        dimensionScores[sd.dimensionID] = {
          riskScore: 0,
          mitigationScore: 0,
          name: this.state.Dimensions.filter(
            (d) => d.dimensionID === sd.dimensionID
          )[0]?.name,
        };
        dimensionScores[sd.dimensionID].riskScore += sd.riskScore;
        dimensionScores[sd.dimensionID].mitigationScore += sd.mitigationScore;
      }
      totalRiskScore += sd.riskScore;
      totalMitigationScore += sd.mitigationScore;
      // Calculate organization score
      if (sd.organizationScore) {
        totalOrganizationScore += sd.organizationScore;
      }
    }
    console.log('ds', dimensionScores);
    // console.log('total org', totalOrganizationScore)
    // console.log('total risk', totalRiskScore)
    // console.log('total mitigia', totalMitigationScore)
    // calc organization bonus to mitigation score
    var organizationResults = QuestionScore.calculateOrganization(
      totalOrganizationScore,
      this.state.Settings.find(
        (s) => s.settingsName === 'Organizational Maturity'
      )?.data
    );
    totalMitigationScore += organizationResults['bonus'];
    let organizationMaturityLabel = organizationResults['label'];
    // console.log(totalMitigationScore)
    //
    // calculate risk level
    let riskLevel = QuestionScore.calculateRiskLevel(
      totalRiskScore,
      this.state.Settings.find((s) => s.settingsName === 'Risk Score')?.data
        ?.lowerBound,
      this.state.Settings.find((s) => s.settingsName === 'Risk Score')?.data
        ?.upperBound
    );
    // console.log('risk level', riskLevel)
    // calculate certification level
    let certification = QuestionScore.calculateCertification(
      totalMitigationScore,
      riskLevel,
      this.state.Settings.find((s) => s.settingsName === 'Score Card')?.data
    );

    var subDimScoresDict = {};
    for (let key in dimensionScores) {
      let scoreDict = dimensionScores[key];
      subDimScoresDict[scoreDict['name']] = {
        riskScore: scoreDict['riskScore'],
        mitigationScore: scoreDict['mitigationScore'],
      };
    }

    var titleQuestion = allQuestions.find(
      (question) => question.title.default === 'Title of project'
    );
    var descriptionQuestion = allQuestions.find(
      (question) => question.title.default === 'Project Description'
    );
    var industryQuestion = allQuestions.find(
      (question) => question.title.default === 'Industry'
    );
    var cityQuestion = allQuestions.find(
      (question) => question.title.default === 'City'
    );
    var regionQuestion = allQuestions.find(
      (question) => question.title.default === 'Country'
    );

    var organizationQuestion = allQuestions.find(
      (question) => question.title.default === 'Company or Organization'
    );
    var representativeQuestion = allQuestions.find(
      (question) => question.title.default === 'Representative'
    );
    var contactQuestion = allQuestions.find(
      (question) => question.title.default === 'Contact information'
    );

    var projectTitle = surveyResults[titleQuestion?.name];
    var projectDescription = surveyResults[descriptionQuestion?.name];

    var projectIndustry = industryQuestion?.choices?.find(
      (choice) => choice.value === surveyResults[industryQuestion?.name]
    )?.text?.default;

    var projectCity = surveyResults[cityQuestion?.name];

    var projectRegion = regionQuestion?.choices?.find(
      (choice) => choice.value === surveyResults[regionQuestion?.name]
    )?.text?.default;

    var projectOrganization = surveyResults[organizationQuestion?.name];
    var projectRepresentative = surveyResults[representativeQuestion?.name];
    var projectContact = surveyResults[contactQuestion?.name];

    var questions = allQuestions.filter((question) =>
      Object.keys(surveyResults).includes(question.name)
    );

    var radarChartData = [];
    if (this.state.Dimensions.length === 0) {
      return null;
    } else
      return (
        <main
          id="wb-cont"
          role="main"
          property="mainContentOfPage"
          className="container"
          style={{ paddingBottom: '1rem' }}
        >
          <h1 className="section-header">Results</h1>
          <button
            id="exportButton"
            type="button"
            className="btn btn-save mr-2 btn btn-primary export-button-pdf"
            onClick={() => {
              ExportHandler();
              exportReport(
                projectTitle,
                projectDescription,
                projectIndustry,
                projectRegion,
                riskLevel[riskWeight ?? 1]
              );
            }}
          >
            Export as PDF
          </button>
          <button
            id="exportButtonCSV"
            type="button"
            className="btn btn-save mr-2 btn btn-primary export-button-csv"
            onClick={() => {
              this.downloadCSV(surveyResults, questions);
            }}
          >
            Export as CSV
          </button>
          <Tabs defaultActiveKey="report-card">
            <Tab eventKey="report-card" title="Report Card">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={this.state?.Dimensions[2]?.label}
              >
                <Tab.Content>
                  <div
                    id="pdf-header"
                    style={{ textAlign: 'center', marginBottom: '50px' }}
                  >
                    <h1>RAI Certification for Finance</h1>
                    <h1 style={{ paddingBottom: '50px' }}>
                      SYSTEM REPORT CARD
                    </h1>

                    {/* <img
                      src={Badge}
                      width="20%"
                      style={{ paddingBottom: '10px' }}
                    />
                    <h3>
                      <strong>CERTIFIED</strong>
                    </h3> */}
                  </div>
                  <hr
                    style={{
                      color: 'black',
                      backgroundColor: 'black',
                      height: 1,
                      margin: '0 0 2px 0',
                      padding: '0',
                    }}
                  />
                  <hr
                    style={{
                      color: 'black',
                      backgroundColor: 'black',
                      height: 1,
                      margin: '0',
                      padding: '0',
                    }}
                  />
                  <div
                    id="project-info"
                    className="row"
                    style={{ padding: '10px' }}
                  >
                    <div className="column">
                      <h5>
                        <strong>PROJECT INFORMATION</strong>
                      </h5>
                      <p>
                        TITLE:
                        <br /> {projectTitle}
                        <br />
                        ORGANIZATION:
                        <br />
                        {projectOrganization}
                        <br />
                        DESCRIPTION:
                        <br /> {projectDescription}
                        <br />
                        INDUSTRY:
                        <br />
                        {projectIndustry}
                        <br />
                        CITY:
                        <br />
                        {projectCity}
                        <br />
                        COUNTRY:
                        <br /> {projectRegion}
                        <br />
                      </p>
                    </div>
                    <div className="column">
                      <h5>
                        <strong>CERTIFICATION RESULTS</strong>
                      </h5>
                      {/* DEPENDING ON SCORES */}
                      <p>
                        <strong>
                          CERTIFICATION LEVEL:
                          {certification
                            ? certication
                            : ' Certification not achieved'}
                        </strong>{' '}
                        <br />
                        The RAIL Certification is an accredited independent
                        review program assessing the responsible use of AI
                        systems. This program incorporates four levels of
                        achievement ranging from certified to platinum. By
                        achieving the silver certification level, the basic
                        certification level has been surpassed demonstrating
                        more advanced practices have been achieved.
                        <br />
                        <br />
                        <strong>
                          ORGANIZATIONAL MATURITY LEVEL:{' '}
                          {organizationMaturityLabel}
                        </strong>
                        <br />
                        The RAIL certification program incorporates an
                        organizational maturity assessment given that complex
                        projects like AI require a solid foundation.
                        Organizational maturity ranges from tactical, to
                        strategic, to transformative.
                        <br />
                        <br />
                        <strong>PROJECT RISK LEVEL: {riskLevel}</strong>
                        <br />
                        Not all AI systems carry the same risk. Recognizing
                        this, the RAI Certification program factors the risk of
                        the system into the overall evaluation. The lower the
                        risk of the system, the fewer mitigation requirements
                        are required.
                        <br />
                      </p>
                    </div>
                    <div className="column" style={{ textAlign: 'center' }}>
                      <img
                        src={Badge}
                        width="70%"
                        style={{
                          paddingBottom: '10px',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          marginTop: 'auto',
                          marginBottom: 'auto',
                        }}
                      />
                    </div>
                    {/* <div
                      className="column-left"
                      style={{ borderRightStyle: 'solid', padding: '10px' }}
                    >
                      <h5>PROJECT INFORMATION</h5>
                      <p>
                        <strong>TITLE</strong>:<br /> {projectTitle}
                        <br />
                        <strong>DESCRIPTION</strong>:<br /> {projectDescription}
                        <br />
                        <strong>ORGANIZATION</strong>:<br />
                        {projectOrganization}
                        <br />
                        <strong>INDUSTRY</strong>:<br />
                        {projectIndustry}
                        <br />
                        <strong>CITY</strong>:<br />
                        {projectCity}
                        <br />
                        <strong>COUNTRY</strong>:<br /> {projectRegion}
                        <br />
                        <strong>Representative</strong>:<br />
                        {projectRepresentative}
                        <br />
                        <strong>Contact Information</strong>:<br />
                        {projectContact}
                        <br />
                      </p>
                    </div> */}
                    {/* <div
                      className="column-right"
                      style={{
                        padding: '10px',
                      }}
                    >
                      <h5>CERTIFICATION RESULTS</h5> */}
                    {/* DEPENDING ON SCORES */}
                    {/* <p>
                        <strong>CERTIFICATION LEVEL:{certification ? certication : "NOT CERTIFIED"}</strong> <br />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Integer sit amet rhoncus libero, id gravida tellus.
                        Nulla sit amet dignissim erat. Cras ut dolor ipsum. Nunc
                        at semper augue. Mauris aliquet porta quam, ut maximus
                        ipsum tempus vitae. Sed pharetra dui justo, sed pulvinar
                        dolor elementum rhoncus.
                        <br />
                        <br />
                        <strong>ORGANIZATIONAL MATURITY LEVEL: {organizationMaturityLabel}</strong>
                        <br />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Proin nec nibh arcu.
                        <br />
                        <br />
                        <strong>PROJECT RISK LEVEL: {riskLevel}</strong>
                        <br />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed eget ultricies elit. Maecenas quis erat et dolor
                        gravida vehicula. Suspendisse.
                        <br />
                      </p>
                      <hr
                        style={{
                          color: 'black',
                          backgroundColor: 'black',
                          width: '100%',
                          height: 2,
                        }}
                      />
                      <h5>RESULTS SUMMARY:</h5>
                      <h6>MITIGATION</h6>
                      {this.state.Dimensions.map((dimension, idx) => {
                        if (dimension.label !== 'T') {
                          return (
                            <div className="row">
                              <div
                                className="column"
                                style={{ padding: '15px' }}
                              >
                                <p>
                                  {dimension.name.toUpperCase()}
                                  <br /> Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit. Integer sit amet rhoncus
                                  libero, id gravida tellus.
                                </p>
                              </div>
                              <div
                                className="column"
                                style={{ paddingTop: '10%' }}
                              >
                                <LevelBar />
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div> */}
                  </div>
                  <hr
                    style={{
                      color: 'black',
                      backgroundColor: 'black',
                      height: 1,
                      margin: '0 0 2px 0',
                      padding: '0',
                    }}
                  />
                  <hr
                    style={{
                      color: 'black',
                      backgroundColor: 'black',
                      height: 1,
                      margin: '0',
                      padding: '0',
                    }}
                  />
                  <div id="results" className="row" style={{ padding: '10px' }}>
                    <div className="column-left">
                      <h5>
                        <strong>RESULTS SUMMARY:</strong>
                      </h5>
                      <br />
                      <h6>
                        <strong>MITIGATION LEVEL</strong>
                      </h6>
                      <div className="row">
                        <div className="col">
                          ROBUSTNESS
                          <br />
                          Ensuring the efficacy of the underlying technology in
                          the system.
                          <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar
                            show={true}
                            title={['LIMITED', 'MATURE', 'PROFICIENT']}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          ACCOUNTABILITY
                          <br />
                          Overseeing measures and procedures required for AI
                          systems.
                          <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          BIAS & FAIRNESS
                          <br />
                          Ensuring equity in the implementation of these
                          systems.
                          <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          DATA
                          <br />
                          Providing high-quality data to ensure the effective
                          operation of AI Systems. <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          INTERPRETABILITY
                          <br />
                          Understanding how AI systems make or interpret
                          decisions. <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar />
                        </div>
                      </div>
                      <br />
                      <br />
                      <h6>
                        <strong>ORGANIZATIONAL MATURITY LEVEL</strong>
                      </h6>
                      <div className="row">
                        <div className="col">
                          STRATEGY
                          <br />
                          Demonstrating predetermined planning for the design,
                          development, and deployment of AI systems.
                          <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar
                            show={true}
                            title={['TACTICAL', 'STRATEGIC', 'TRANSFORMATIVE']}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          GOVERNANCE
                          <br />
                          Ensuring accountability and oversight of the people
                          and processes building and managing AI systems..
                          <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          PEOPLE
                          <br />
                          Verifying the capabilities and competencies of team
                          members involved in the design and development of AI
                          systems.
                          <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar />
                        </div>
                      </div>
                      <br />
                      <br />
                      <h6>
                        <strong>PROJECT RISK LEVEL</strong>
                      </h6>
                      <div className="row">
                        <div className="col">
                          DATA
                          <br />
                          Assessment of the data input to the AI system.
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar
                            show={true}
                            title={['LOW', 'MEDIUM', 'HIGH']}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          MODELS
                          <br />
                          Overseeing measures and procedures required for AI
                          systems.
                          <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          PROCESSES
                          <br />
                          The context in which the system is being deployed.{' '}
                          <br />
                          <br />
                        </div>
                        <div className="col">
                          <LevelBar />
                        </div>
                      </div>
                    </div>
                    {/* <div className="column" style={{ paddingTop: '60px' }}>
                      <LevelBar show={true} />
                      <LevelBar />
                      <LevelBar />
                      <LevelBar />
                      <LevelBar />
                    </div> */}
                    <div
                      className="column-right"
                      style={{
                        textAlign: 'center',
                        alignItems: 'center',
                        paddingTop: '10px',
                      }}
                    >
                      <h6>
                        <strong>BADGES ACHIEVED</strong>
                      </h6>
                    </div>
                  </div>
                  <div className="row" style={{ padding: '10px' }}>
                    <div className="column"></div>
                  </div>

                  {this.state.Dimensions.map((dimension, idx) => {
                    if (dimension.label !== 'T' && dimension.label != 'O') {
                      return (
                        <Tab.Pane key={idx} eventKey={dimension.label}>
                          <ReportCard
                            dimension={dimension.label}
                            results={surveyResults}
                            questions={questions.filter(
                              (x) => x.score?.dimension === dimension.label
                            )}
                          />
                        </Tab.Pane>
                      );
                    }
                    return null;
                  })}
                </Tab.Content>
                <Nav
                  variant="tabs"
                  className="report-card-nav"
                  defaultActiveKey="accountability"
                >
                  {this.state.Dimensions.map((dimension, idx) => {
                    if (dimension.label !== 'T') {
                      return (
                        <Nav.Item key={idx}>
                          <Nav.Link eventKey={dimension.label}>
                            {dimension.name}
                          </Nav.Link>
                        </Nav.Item>
                      );
                    }
                    return null;
                  })}
                </Nav>
              </Tab.Container>
            </Tab>
            {/* <Tab eventKey="ai-providers" title="Trusted AI Providers">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={this.state.Dimensions[0].label}
              >
                <TrustedAIProviders />
              </Tab.Container>
            </Tab> */}
            <Tab eventKey="ai-resources" title="Trusted AI Resources">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={this.state.Dimensions[0].label}
              >
                <TrustedAIResources />
              </Tab.Container>
            </Tab>
          </Tabs>
          <div
            style={{ marginTop: '40px', marginBottom: '140px' }}
          >
            <h4>Certification Level: {certification}</h4>
            <p>
              <strong>
                Risk Score: {totalRiskScore} | Mitigation Score:{' '}
                {totalMitigationScore} | Organization Score:{' '}
                {totalOrganizationScore}
              </strong>
            </p>

            <p>
              As‌ ‌AI‌ ‌continues‌ ‌to‌ ‌evolve‌ ‌so‌ ‌will‌ ‌the‌ ‌Design‌
              ‌Assistant.‌ ‌ We‌ ‌are‌ ‌working‌ ‌now‌ ‌to‌ ‌add‌ questions‌
              ‌that‌ ‌are‌ ‌more‌ ‌industry‌ ‌specific‌ ‌and‌ ‌tailored‌ ‌for‌
              ‌your‌ ‌location.‌ ‌To‌ ‌do‌ ‌this,‌ ‌we‌ can‌ ‌use‌ ‌your‌
              ‌help!‌ ‌Share‌ ‌with‌ ‌us‌ ‌the‌ ‌results‌ ‌of‌ ‌your‌ ‌report.‌
              ‌Let‌ ‌us‌ ‌know‌ ‌where‌ ‌you‌ ‌need‌ more‌ ‌clarification,‌
              ‌and‌ ‌where‌ ‌more‌ ‌guidance‌ ‌might‌ ‌be‌ ‌needed.‌ If‌ ‌you‌
              ‌weren’t‌ ‌ready‌ ‌to‌ ‌answer‌ ‌all‌ ‌of‌ ‌the‌ ‌questions‌
              ‌today,‌ ‌that’s‌ ‌ok,‌ ‌save‌ ‌your‌ ‌report,‌ ‌and‌ you‌ ‌can‌
              ‌reload‌ ‌it‌ ‌the‌ ‌next‌ ‌time‌ ‌you‌ ‌return.‌
            </p>
            <p>
              As‌ ‌an‌ ‌open‌ ‌source‌ ‌tool,‌ ‌we‌ ‌will‌ ‌continue‌ ‌to‌
              ‌adjust‌ ‌quickly‌ ‌based‌ ‌on‌ ‌our‌ ‌communities‌ needs.‌
              ‌Please‌ ‌let‌ ‌us‌ ‌know‌ ‌if‌ ‌you‌ ‌find‌ ‌any‌ ‌issues‌ ‌and‌
              ‌we‌ ‌will‌ ‌be‌ ‌happy‌ ‌to‌ ‌update!‌
            </p>
            <p>
              If‌ ‌you‌ ‌are‌ ‌wondering‌ ‌what‌ ‌to‌ ‌do‌ ‌with‌ ‌your‌
              ‌results,‌ ‌and‌ ‌how‌ ‌you‌ ‌can‌ ‌improve,‌ ‌check‌ ‌out‌ the
              Responsible AI Design Assistant Guide ‌that‌ ‌includes‌
              ‌definitions‌ ‌and‌ ‌lots‌ ‌of‌ additional‌ ‌information.‌ ‌ If‌
              ‌you‌ ‌are‌ ‌in‌ ‌need‌ ‌of‌ ‌additional‌ ‌support,‌ ‌contact‌
              ‌us,‌ ‌and‌ ‌we‌ ‌can‌ put‌ ‌you‌ ‌in‌ ‌touch‌ ‌with‌ ‌a‌
              ‌trusted‌ ‌service‌ ‌provider.‌
            </p>
            <p>
              Since‌ ‌we‌ ‌want‌ ‌you‌ ‌to‌ ‌use‌ ‌the‌ ‌Design‌ ‌Assistant‌
              ‌early‌ ‌and‌ ‌often,‌ ‌you‌ ‌can‌ ‌click‌ ‌the‌ ‌button‌ below‌
              ‌to‌ ‌start‌ ‌over‌ ‌again!‌
            </p>
            <Link to="/">
              <Button id="restartButton" onClick={StartAgainHandler}>
                Start Again
              </Button>
            </Link>
            <button
              id="exportButton"
              type="button"
              className="btn btn-save mr-2 btn btn-primary export-button"
              onClick={() => {
                ExportHandler();
                exportReport(
                  projectTitle,
                  projectDescription,
                  projectIndustry,
                  projectRegion,
                  riskLevel[riskWeight ?? 1]
                );
              }}
            >
              Export as PDF
            </button>
          </div>
          <Login />
        </main>
      );
  }
}
