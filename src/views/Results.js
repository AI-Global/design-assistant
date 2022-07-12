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
import { createCertificationDocx } from '../helper/ExportDocx';
import DimensionScore from './DimensionScore';
import Certification from './Certification'
import TrustedAIResources from './TrustedAIResources';
import ReactGa from 'react-ga';
import Summary from './Summary';
import Login from './Login';
import calculateQuestionScore from '../helper/QuestionScore';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
import { CallMadeOutlined } from '@material-ui/icons';

// material-ui components
import { Grid } from '@material-ui/core';


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
      submissionId: null,
      submission: null,
      alternateReport: false,
      SubDimensions: [],
      questionsData: null,
    };
    this.addRiskToSubmission = this.addRiskToSubmission.bind(this);
  }

  componentDidMount() {
    const dimensionOrder = [
      'System Operations',
      'Explainability & Interpretability',
      'Accountability',
      'Consumer Protection',
      'Bias & Fairness',
      'Robustness'
    ];
    const getSortVal = (name) => dimensionOrder.includes(name) ? dimensionOrder.indexOf(name) : 20;
    ReactGa.pageview(window.location.pathname + window.location.search);
    api.get('dimensions').then((res) => {
      this.setState({
        Dimensions: res.data.sort((a, b) =>
          (getSortVal(a.name) > getSortVal(b.name))
            ? 1 : ((getSortVal(b.name) > getSortVal(a.name))
              ? -1 : 0))
      });
    });
    api.get('subdimensions').then((res) => {
      this.setState({ SubDimensions: res.data });
    });
    this.setState({ submissionId: this?.props?.location?.state?.submissionId });
    this.setState({ submission: this?.props?.location?.state?.data });
    this.setState({
      alternateReport: this?.props?.location?.state?.alternateReport,
    });
    api.get('questions/all').then((res) => {
      this.setState({ questionsData: res.data.questions });
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

  addRiskToSubmission(riskWeight) {
    const submissionRiskLevel = riskLevel[riskWeight];
    if (this.state.submissionId) {
      api
        .get(`submissions/submission/${this.state?.submissionId}`)
        .then((res) => {
          const submission = res.data.submission;
          // console.log(submission);
          api.post('submissions/update/' + this.state?.submissionId, {
            ...submission,
            riskLevel: submissionRiskLevel,
          });
        });
    }
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
    //     pathname: '/SystemAssessment',
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
    this.addRiskToSubmission(riskWeight);

    var titleQuestion = allQuestions.find(
      (question) => question.title.default === 'Name of AI System' || question.title.default === 'Project Name'
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
          style={{ paddingBottom: '1rem', paddingTop: '5rem' }}
        >
          <h1 className="section-header">
            Results
             <p
              style={{
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '24px',
                color: '#007bff',
                cursor: 'pointer'
              }}
              onClick={() => {
                createCertificationDocx(
                  projectTitle,
                  projectDescription,
                  projectIndustry,
                  projectRegion,
                  riskLevel[riskWeight ?? 1],
                  this.state.Dimensions,
                  this.state.SubDimensions,
                  surveyResults,
                  this.state.questionsData,
                )
              }}
            >
              <SystemUpdateAltOutlinedIcon /> Download report
          </p>
            <p style={{
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '24px',
              color: '#00C1B4',
              cursor: 'pointer'
            }}>
              <a href="" target="_blank"> <CallMadeOutlined /> Assessment guide </a>
            </p>
          </h1>
          {this.state.alternateReport ? (
            <iframe
              src="https://drive.google.com/file/d/1f6RorHTlDbl309FbgJpvYJpivGUB-454/preview"
              width="100%"
              height="1000px"
              allow="autoplay"
            ></iframe>
          ) : (
            <div>
              {/* <button
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
                id="exportDocx"
                type="button"
                className="btn btn-save mr-2 btn btn-primary export-button-docx"
                onClick={() => {
                  createCertificationDocx(
                    projectTitle,
                    projectDescription,
                    projectIndustry,
                    projectRegion,
                    riskLevel[riskWeight ?? 1],
                    this.state.Dimensions,
                    this.state.SubDimensions)
                }}
              >
                Export as MS Word
              </button> */}
              <Grid container>
                <Grid item xs={12}>
                  <Tabs
                    className="report-card-nav"
                    defaultActiveKey="summary">
                    <Tab eventKey='summary' title='Summary' key='summary'>
                      <Tab.Pane eventKey='summary'>
                        <Summary
                          dimensions={this.state.Dimensions.filter(dimension => dimension.label !== 'T')}
                          results={surveyResults}
                          questions={questions}
                          subDimensions={this.state.SubDimensions}
                          submission={this.state.submission}
                        />
                      </Tab.Pane>
                    </Tab>
                    {this.state.Dimensions.map((dimension, idx) => (
                      <Tab eventKey={dimension.name} key={dimension.name} title={dimension.name}>
                        <Tab.Pane key={idx} eventKey={dimension.label}>
                          <Certification
                            dimension={dimension}
                            results={surveyResults}
                            questions={questions.filter(
                              (x) => x.score?.dimension === dimension.label
                            )}
                            subDimensions={this.state.SubDimensions}
                            submission={this.state.submission}
                          />
                        </Tab.Pane>
                      </Tab>
                    ))}
                  </Tabs>
                </Grid>
              </Grid>
            </div>
          )}
          {/* <Link to="/">
            <Button
              id="restartButton"
              onClick={StartAgainHandler}
              style={{ marginTop: '10px' }}
            >
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
          </button> */}
          <Login />
        </main>
      );
  }
}
