import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import { Tabs, Tab, Table, Button, Nav } from 'react-bootstrap';
import "../css/results.css";
import { ResponsiveRadar } from "@nivo/radar";
import exportReport from "../helper/ExportReport";
import ReportCard from "./ReportCard";
import DimensionScore from "./DimensionScore";
import TrustedAIProviders from './TrustedAIProviders';
import TrustedAIResources from './TrustedAIResources';
import ReactGa from 'react-ga';
import Login from './Login';

ReactGa.initialize(process.env.REACT_APP_GAID, { testMode: process.env.NODE_ENV === 'test' });

const StartAgainHandler = () => {
    ReactGa.event({
        category: 'Button',
        action: 'Clicked the Start Again button from the Results page'
    })
}

const ExportHandler = () => {
    ReactGa.event({
        category: 'Button',
        action: 'Exported report as PDF'
    })
}

/**
 * Component processes the answers to the survey and
 * renders the results to the user in various different ways.
 */
export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Dimensions: []
        }
    }

    componentDidMount() {
        
        ReactGa.pageview(window.location.pathname + window.location.search);
        axios.get(process.env.REACT_APP_SERVER_ADDR +'/dimensions').then((res) => {
            this.setState({Dimensions: res.data});
          });
    }

    downloadCSV(surveyResults, questions) {
        console.log("downloading csv");
        console.log(questions);
        console.log(surveyResults);

        // <Tab.Content>
        //     {this.state.Dimensions.map((dimension, idx) => {
        //         return (
        //             <Tab.Pane key={idx} eventKey={dimension.label}>
        //                 <ReportCard dimension={dimension.label} results={surveyResults} questions={questions.filter(x => x.score?.dimension === dimension.label)} />
        //             </Tab.Pane>
        //         );
        //     })}
        // </Tab.Content>

        // iterate over dimensions, then iterate over questions in each dimension
        // then map choices to question and create row in csv file

        this.state.Dimensions.map((dimension, idx) => {
            
        })



        // current json structure is formed with IDs and is therefore unreadable
        // to a person.

        // Need to obtain questions separately, then map responses to the questions
        // and output this information to the csv

        // does results page already hold all the information I need?

        // I need all the details about the submission itself and then of course all the contents
        // I can do this by parsing from json or I can do what reportCard.js does?










        // // var content = "test content";
        // var content = JSON.stringify(this.state.submissions[submissionIdx].submission);

        // console.log(this.state.submissions[submissionIdx].submission);

        // // any kind of extension (.txt,.cpp,.cs,.bat)
        // // var filename = "hello.txt";
        // var filename = this.state.submissions[submissionIdx].userId + "_" + this.state.submissions[submissionIdx].projectName + ".json";

        // var blob = new Blob([content], {
        //     type: "text/plain;charset=utf-8"
        // });

        // saveAs(blob, filename);
    }

    render() {
        var json = this?.props?.location?.state?.questions;
        var surveyResults = this?.props?.location?.state?.responses;
        if (json === undefined || surveyResults === undefined) {
            this.props.history.push({
                pathname: '/'
            })
            return null;
        }
        var pages = json["pages"];
        var allQuestions = [];
        pages.map(page => {
            allQuestions = allQuestions.concat(page?.elements);
            return allQuestions
        });

        var titleQuestion = allQuestions.find(question => question.title.default === "Title of project");
        var descriptionQuestion = allQuestions.find(question => question.title.default === "Project Description");
        var industryQuestion = allQuestions.find(question => question.title.default === "Industry");
        var regionQuestion = allQuestions.find(question => question.title.default === "Country");

        var projectTitle = surveyResults[titleQuestion?.name];
        var projectDescription = surveyResults[descriptionQuestion?.name];

        var projectIndustry = industryQuestion?.choices?.find(
            (choice) => choice.value === surveyResults[industryQuestion?.name]
        )?.text?.default

        var projectRegion = regionQuestion?.choices?.find(
            (choice) => choice.value === surveyResults[regionQuestion?.name]
        )?.text?.default


        var questions = allQuestions.filter((question) => Object.keys(surveyResults).includes(question.name))

        var radarChartData = [];
        if(this.state.Dimensions.length === 0){
            return null;
        } else return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">
                    Results
                </h1>
                <button id="exportButton" type="button" className="btn btn-save mr-2 btn btn-primary export-button" onClick={() => {ExportHandler(); exportReport(projectTitle, projectDescription, projectIndustry, projectRegion)}}>Export</button>
                <button id="exportButtonCSV" type="button" className="btn btn-save mr-2 btn btn-primary export-button-csv" onClick={() => {this.downloadCSV(surveyResults, questions)}}>Export as CSV</button>
                <Tabs defaultActiveKey="score">
                    <Tab eventKey="score" title="Score">
                        <div className="table-responsive mt-3">
                            <Table id="score" bordered hover responsive className="report-card-table">
                                <thead>
                                    <tr>
                                        <th className="score-card-dheader">
                                            Dimensions
                                        </th>
                                        <th className="score-card-headers">
                                            Needs to improve
                                        </th>
                                        <th className="score-card-headers">
                                            Acceptable
                                        </th>
                                        <th className="score-card-headers">
                                            Proficient
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.Dimensions.map((dimension, idx) => {
                                        return (
                                            <DimensionScore key={idx} radarChartData={radarChartData} dimensionName={dimension.name}
                                                results={surveyResults} questions={allQuestions.filter(x => x.score?.dimension === dimension.label)} />
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="report-card" title="Report Card">
                        <Tab.Container id="left-tabs-example" defaultActiveKey={this.state.Dimensions[0].label}>
                            <Tab.Content>
                                {this.state.Dimensions.map((dimension, idx) => {
                                    return (
                                        <Tab.Pane key={idx} eventKey={dimension.label}>
                                            <ReportCard dimension={dimension.label} results={surveyResults} questions={questions.filter(x => x.score?.dimension === dimension.label)} />
                                        </Tab.Pane>
                                    );
                                })}
                            </Tab.Content>
                            <Nav variant="tabs" className="report-card-nav" defaultActiveKey="accountability">
                                {this.state.Dimensions.map((dimension, idx) => {
                                    return (
                                        <Nav.Item key={idx} >
                                            <Nav.Link eventKey={dimension.label}>
                                                {dimension.name}
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })}
                            </Nav>
                        </Tab.Container>
                    </Tab>
                    <Tab eventKey="ai-providers" title="Trusted AI Providers">
                        <Tab.Container id="left-tabs-example" defaultActiveKey={this.state.Dimensions[0].label}>
                            <TrustedAIProviders />
                        </Tab.Container>
                    </Tab>
                    <Tab eventKey="ai-resources" title="Trusted AI Resources">
                        <Tab.Container id="left-tabs-example" defaultActiveKey={this.state.Dimensions[0].label}>
                            <TrustedAIResources />
                        </Tab.Container>
                    </Tab>
                </Tabs>
                <div className="dimension-chart">
                    <ResponsiveRadar
                        data={radarChartData}
                        keys={["score"]}
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
                    As‌ ‌AI‌ ‌continues‌ ‌to‌ ‌evolve‌ ‌so‌ ‌will‌ ‌the‌ ‌Design‌ ‌Assistant.‌ ‌
                    We‌ ‌are‌ ‌working‌ ‌now‌ ‌to‌ ‌add‌ questions‌ ‌that‌ ‌are‌ ‌more‌ ‌industry‌ ‌specific‌ ‌and‌ ‌tailored‌ ‌for‌ ‌your‌ ‌location.‌
                    ‌To‌ ‌do‌ ‌this,‌ ‌we‌ can‌ ‌use‌ ‌your‌ ‌help!‌ ‌Share‌ ‌with‌ ‌us‌ ‌the‌ ‌results‌ ‌of‌ ‌your‌ ‌report.‌
                    ‌Let‌ ‌us‌ ‌know‌ ‌where‌ ‌you‌ ‌need‌ more‌ ‌clarification,‌ ‌and‌ ‌where‌ ‌more‌ ‌guidance‌ ‌might‌ ‌be‌ ‌needed.‌
                    If‌ ‌you‌ ‌weren’t‌ ‌ready‌ ‌to‌ ‌answer‌ ‌all‌ ‌of‌ ‌the‌ ‌questions‌ ‌today,‌ ‌that’s‌ ‌ok,‌ ‌save‌ ‌your‌ ‌report,‌ ‌and‌ you‌ ‌can‌ ‌reload‌ ‌it‌ ‌the‌ ‌next‌ ‌time‌ ‌you‌ ‌return.‌
                </p>
                <p>
                    As‌ ‌an‌ ‌open‌ ‌source‌ ‌tool,‌ ‌we‌ ‌will‌ ‌continue‌ ‌to‌ ‌adjust‌ ‌quickly‌ ‌based‌ ‌on‌ ‌our‌ ‌communities‌ needs.‌
                    ‌Please‌ ‌let‌ ‌us‌ ‌know‌ ‌if‌ ‌you‌ ‌find‌ ‌any‌ ‌issues‌ ‌and‌ ‌we‌ ‌will‌ ‌be‌ ‌happy‌ ‌to‌ ‌update!‌
                </p>
                <p>
                    If‌ ‌you‌ ‌are‌ ‌wondering‌ ‌what‌ ‌to‌ ‌do‌ ‌with‌ ‌your‌ ‌results,‌ ‌and‌ ‌how‌ ‌you‌ ‌can‌ ‌improve,‌ ‌check‌ ‌out‌ the Responsible AI Design Assistant Guide ‌that‌ ‌includes‌ ‌definitions‌ ‌and‌ ‌lots‌ ‌of‌ additional‌ ‌information.‌ ‌
                    If‌ ‌you‌ ‌are‌ ‌in‌ ‌need‌ ‌of‌ ‌additional‌ ‌support,‌ ‌contact‌ ‌us,‌ ‌and‌ ‌we‌ ‌can‌ put‌ ‌you‌ ‌in‌ ‌touch‌ ‌with‌ ‌a‌ ‌trusted‌ ‌service‌ ‌provider.‌
                </p>
                <p>
                    Since‌ ‌we‌ ‌want‌ ‌you‌ ‌to‌ ‌use‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌early‌ ‌and‌ ‌often,‌ ‌you‌ ‌can‌ ‌click‌ ‌the‌ ‌button‌ below‌ ‌to‌ ‌start‌ ‌over‌ ‌again!‌
                </p>
                <Link to='/'>
                    <Button id="restartButton" onClick={StartAgainHandler}>Start Again</Button>
                </Link>
                <Login />
            </main>
        );
    }
}