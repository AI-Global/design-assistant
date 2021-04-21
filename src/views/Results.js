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
import { ResponsiveRadar } from '@nivo/radar';
import exportReport from '../helper/ExportReportSecond';
import ReportCard from './ReportCard';
import DimensionScore from './DimensionScore';
import TrustedAIProviders from './TrustedAIProviders';
import TrustedAIResources from './TrustedAIResources';
import ReactGa from 'react-ga';
import Login from './Login';
import QuestionScore from '../helper/QuestionScore';
import Badge from '../media/Badge.png';

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
  return (
    <>
      <div className="row" style={{ justifyContent: 'center' }}>
        <div className="levels-name">LIMITED</div>
        <div className="levels-name">MATURE</div>
        <div className="levels-name">PROFICIENT</div>

      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <div className="rectangle-black" />
        <div className="rectangle-black" />
        <div className="rectangle-grey" />
      </div>
    </>
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
    contentArr.push('Question,Response,Recommendation\n');

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
        for (let j = 0; j < user_response_ids.length; ++j) {
          var questionText = question?.title?.default;
          var questionResponse = user_response_ids[j]?.text?.default;
          var questionRecommendation = question?.recommendation?.default;

          // we need to check that the field exists, and if it does,
          // replace quotes with double quotes, and surround with quotes
          // this will make the string csv safe
          // if no field, append nothing, a column will still populate
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
          }
          contentArr.push('\n');
        }
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
      subdimensionScores[
        subDimension.subDimensionID
      ] = QuestionScore.calculateSubdimensionScore(
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

    // console.log('d scores', dimensionScores)
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
    totalMitigationScore += organizationResults['bonus']
    let organizationMaturityLabel = organizationResults['label']
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
            Export
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
            {/* <Tab eventKey="score" title="Score">
              <div className="table-responsive mt-3">
                <Table
                  id="score"
                  bordered
                  hover
                  responsive
                  className="report-card-table"
                >
                  <thead>
                    <tr>
                      <th className="score-card-dheader">Dimensions</th>
                      <th className="score-card-headers">Needs to improve</th>
                      <th className="score-card-headers">Acceptable</th>
                      <th className="score-card-headers">Proficient</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.Dimensions.map((dimension, idx) => {
                      if (dimension.label !== 'T' && dimension.label !== 'RK') {
                        return (
                          <DimensionScore
                            key={idx}
                            radarChartData={radarChartData}
                            dimensionName={dimension.name}
                            riskWeight={riskWeight}
                            results={surveyResults}
                            questions={allQuestions.filter(
                              (x) => x.score?.dimension === dimension.label
                            )}
                          />
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </Table>
              </div>
            </Tab> */}
            <Tab eventKey="report-card" title="Report Card">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={this.state?.Dimensions[2]?.label}
              >
                <Tab.Content>
                  <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ paddingBottom: '50px' }}>REPORT CARD</h1>
                    <img
                      src={Badge}
                      width="20%"
                      style={{ paddingBottom: '10px' }}
                    />
                    <h3>
                      <strong>CERTIFIED</strong>
                    </h3>
                  </div>
                  <hr
                    style={{
                      color: 'black',
                      backgroundColor: 'black',
                      height: 1,
                    }}
                  />
                  <div className="row">
                    <div
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
                    </div>
                    <div
                      className="column-right"
                      style={{
                        padding: '10px',
                      }}
                    >
                      <h5>CERTIFICATION RESULTS</h5>
                      {/* DEPENDING ON SCORES */}
                      <p>
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
                    </div>
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
            <Tab eventKey="ai-providers" title="Trusted AI Providers">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={this.state.Dimensions[0].label}
              >
                <TrustedAIProviders />
              </Tab.Container>
            </Tab>
            <Tab eventKey="ai-resources" title="Trusted AI Resources">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={this.state.Dimensions[0].label}
              >
                <TrustedAIResources />
              </Tab.Container>
            </Tab>
          </Tabs>
          <div className="dimension-chart">
            <h4>Certification Level: {certification}</h4>
            <p>
              Risk Score: {totalRiskScore} | Mitigation Score:{' '}
              {totalMitigationScore} | Organization Score:{' '}
              {totalOrganizationScore}
            </p>
            <ResponsiveRadar
              data={radarChartData}
              keys={['score']}
              indexBy="dimension"
              maxValue={100}
              margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
              curve="linearClosed"
              borderWidth={2}
              gridLevels={5}
              gridShape="circular"
              colors="rgb(31, 119, 180)"
              isInteractive={true}
              dotSize={8}
            />
          </div>
          <p>
            As‌ ‌AI‌ ‌continues‌ ‌to‌ ‌evolve‌ ‌so‌ ‌will‌ ‌the‌ ‌Design‌
            ‌Assistant.‌ ‌ We‌ ‌are‌ ‌working‌ ‌now‌ ‌to‌ ‌add‌ questions‌
            ‌that‌ ‌are‌ ‌more‌ ‌industry‌ ‌specific‌ ‌and‌ ‌tailored‌ ‌for‌
            ‌your‌ ‌location.‌ ‌To‌ ‌do‌ ‌this,‌ ‌we‌ can‌ ‌use‌ ‌your‌ ‌help!‌
            ‌Share‌ ‌with‌ ‌us‌ ‌the‌ ‌results‌ ‌of‌ ‌your‌ ‌report.‌ ‌Let‌ ‌us‌
            ‌know‌ ‌where‌ ‌you‌ ‌need‌ more‌ ‌clarification,‌ ‌and‌ ‌where‌
            ‌more‌ ‌guidance‌ ‌might‌ ‌be‌ ‌needed.‌ If‌ ‌you‌ ‌weren’t‌ ‌ready‌
            ‌to‌ ‌answer‌ ‌all‌ ‌of‌ ‌the‌ ‌questions‌ ‌today,‌ ‌that’s‌ ‌ok,‌
            ‌save‌ ‌your‌ ‌report,‌ ‌and‌ you‌ ‌can‌ ‌reload‌ ‌it‌ ‌the‌ ‌next‌
            ‌time‌ ‌you‌ ‌return.‌
          </p>
          <p>
            As‌ ‌an‌ ‌open‌ ‌source‌ ‌tool,‌ ‌we‌ ‌will‌ ‌continue‌ ‌to‌
            ‌adjust‌ ‌quickly‌ ‌based‌ ‌on‌ ‌our‌ ‌communities‌ needs.‌ ‌Please‌
            ‌let‌ ‌us‌ ‌know‌ ‌if‌ ‌you‌ ‌find‌ ‌any‌ ‌issues‌ ‌and‌ ‌we‌ ‌will‌
            ‌be‌ ‌happy‌ ‌to‌ ‌update!‌
          </p>
          <p>
            If‌ ‌you‌ ‌are‌ ‌wondering‌ ‌what‌ ‌to‌ ‌do‌ ‌with‌ ‌your‌
            ‌results,‌ ‌and‌ ‌how‌ ‌you‌ ‌can‌ ‌improve,‌ ‌check‌ ‌out‌ the
            Responsible AI Design Assistant Guide ‌that‌ ‌includes‌
            ‌definitions‌ ‌and‌ ‌lots‌ ‌of‌ additional‌ ‌information.‌ ‌ If‌
            ‌you‌ ‌are‌ ‌in‌ ‌need‌ ‌of‌ ‌additional‌ ‌support,‌ ‌contact‌ ‌us,‌
            ‌and‌ ‌we‌ ‌can‌ put‌ ‌you‌ ‌in‌ ‌touch‌ ‌with‌ ‌a‌ ‌trusted‌
            ‌service‌ ‌provider.‌
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
          <Login />
        </main>
      );
  }
}
