import React, { Component } from 'react';
import api from '../api';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import { Tabs, Tab, Table, Button, Nav } from 'react-bootstrap';
import '../css/results.css';
import { ResponsiveRadar } from '@nivo/radar';
import exportReport from '../helper/ExportReport';
import ReportCard from './ReportCard';
import DimensionScore from './DimensionScore';
import Certification from './Certification'
import TrustedAIProviders from './TrustedAIProviders';
import TrustedAIResources from './TrustedAIResources';
import ReactGa from 'react-ga';
import Login from './Login';
import calculateQuestionScore from '../helper/QuestionScore';

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

const riskLevel = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
};

/**
 * Component processes the answers to the survey and
 * renders the results to the user in various different ways.
 */
export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Dimensions: [],
    };
  }

  componentDidMount() {
    ReactGa.pageview(window.location.pathname + window.location.search);
    api.get('dimensions').then((res) => {
      this.setState({ Dimensions: res.data });
    });
  }

  calculateRiskWeight(riskQuestions, results) {
    var riskScore = 0;
    var maxRiskScore = 0;
    // Calculate total risk based off user responses
    riskQuestions.map((question) => {
      let selectedChoices = results[question.name];
      let questionScore = calculateQuestionScore(question, selectedChoices, 1);
      riskScore += questionScore.score;
      maxRiskScore += questionScore.maxScore;

      return maxRiskScore;
    });

    // Calculate whether Risk level is low medium or high
    var riskWeight = 1;
    if (riskScore > maxRiskScore * 0.66) {
      riskWeight = 3;
    } else if (riskScore > maxRiskScore * 0.33) {
      riskWeight = 2;
    }

    return riskWeight;
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
    var submission = this?.props?.location?.state?.submission;
    if (json === undefined || surveyResults === undefined) {
      this.props.history.push({
        pathname: '/',
      });
      return null;
    }

    // // edit a survey that has already been completed
    // const editSurvey = () => {
    //   this.props.history.push({
    //     pathname: '/DesignAssistantSurvey',
    //     state: {
    //       prevResponses: submission.submission,
    //       submission_id: submission._id,
    //     },
    //   });
    // }

    var pages = json['pages'];
    var allQuestions = [];
    pages.map((page) => {
      allQuestions = allQuestions.concat(page?.elements);
      return allQuestions;
    });

    var riskWeight = this.calculateRiskWeight(
      allQuestions.filter((x) => x.score?.dimension === 'RK'),
      surveyResults
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
    var regionQuestion = allQuestions.find(
      (question) => question.title.default === 'Country'
    );

    var projectTitle = surveyResults[titleQuestion?.name];
    var projectDescription = surveyResults[descriptionQuestion?.name];

    var projectIndustry = industryQuestion?.choices?.find(
      (choice) => choice.value === surveyResults[industryQuestion?.name]
    )?.text?.default;

    var projectRegion = regionQuestion?.choices?.find(
      (choice) => choice.value === surveyResults[regionQuestion?.name]
    )?.text?.default;

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
          <Tabs defaultActiveKey="score">
            <Tab eventKey="score" title="Score">
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
            </Tab>
            <Tab eventKey="report-card" title="Report Card">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={this.state?.Dimensions[2]?.label}
              >
                <Tab.Content>
                  {this.state.Dimensions.map((dimension, idx) => {
                    if (dimension.label !== 'T') {
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
            <Tab eventKey="certification" title="Certification">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={this.state?.Dimensions[2]?.label}
              >
                <Tab.Content>
                  {this.state.Dimensions.map((dimension, idx) => {
                    if (dimension.label !== 'T') {
                      return (
                        <Tab.Pane key={idx} eventKey={dimension.label}>
                          <Certification
                            dimension={dimension}
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
          <div className="dimension-chart" style={{ marginBottom: '80px', marginTop: '40px' }}>
            <h4>Risk Level: {riskLevel[riskWeight ?? 1]}</h4>
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
            <Button id="restartButton" onClick={StartAgainHandler} style={{ marginTop: '10px' }}>
              Start Again
            </Button>
          </Link>
          <button
            id="exportButton"
            type="button"
            className="btn btn-save mr-2 btn btn-primary"
            style={{ marginTop: '10px', marginLeft: '13px' }}
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
          <Login />
        </main>
      );
  }
}
