import React, { Component } from 'react';
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
import ReactGa from 'react-ga';

ReactGa.initialize(process.env.REACT_APP_GAID, { testMode: process.env.NODE_ENV === 'test' });

const Dimensions = {
    Accountability: { label: "A", name: "Accountability" },
    Explainability: { label: "EI", name: "Explainability" },
    Data: { label: "D", name: "Data quality and rights" },
    Bias: { label: "B", name: "Bias and fairness" },
    Robustness: { label: "R", name: "Robustness" },
}

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

    componentDidMount() {
        ReactGa.pageview(window.location.pathname + window.location.search);
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
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">
                    Results
                </h1>
                <button id="exportButton" type="button" className="btn btn-save mr-2 btn btn-primary export-button" onClick={() => {ExportHandler(); exportReport(projectTitle, projectDescription, projectIndustry, projectRegion)}}>Export</button>
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
                                    {Object.keys(Dimensions).map((dimension, idx) => {
                                        return (
                                            <DimensionScore key={idx} radarChartData={radarChartData} dimensionName={Dimensions[dimension]?.name}
                                                results={surveyResults} questions={allQuestions.filter(x => x.score?.dimension === Dimensions[dimension]?.label)} />
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="report-card" title="Report Card">
                        <Tab.Container id="left-tabs-example" defaultActiveKey={Object.values(Dimensions)[0]?.label}>
                            <Tab.Content>
                                {Object.keys(Dimensions).map((dimension, idx) => {
                                    return (
                                        <Tab.Pane key={idx} eventKey={Dimensions[dimension]?.label}>
                                            <ReportCard dimension={Dimensions[dimension]?.label} results={surveyResults} questions={questions.filter(x => x.score?.dimension === Dimensions[dimension]?.label)} />
                                        </Tab.Pane>
                                    );
                                })}
                            </Tab.Content>
                            <Nav variant="tabs" className="report-card-nav" defaultActiveKey="accountability">
                                {Object.keys(Dimensions).map((dimension, idx) => {
                                    return (
                                        <Nav.Item key={idx} >
                                            <Nav.Link eventKey={Dimensions[dimension]?.label}>
                                                {Dimensions[dimension]?.name}
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })}
                            </Nav>
                        </Tab.Container>
                    </Tab>
                    <Tab eventKey="ai-providers" title="Trusted AI Providers">
                        <Tab.Container id="left-tabs-example" defaultActiveKey={Object.values(Dimensions)[0]?.label}>
                            <TrustedAIProviders />
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
            </main>
        );
    }
}