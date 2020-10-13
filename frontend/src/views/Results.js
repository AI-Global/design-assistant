import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { Tabs, Tab, Table, Button, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons'
import "../css/results.css"
import { ResponsiveRadar } from "@nivo/radar";
import exportReport from "./ExportReport";

const Dimensions = {
    Accountability: {label: "A", name: "Accountability"},
    Explainability: {label: "EI", name: "Explainability"},
    Data: {label: "D", name: "Data quality and rights"},
    Bias: {label: "B", name: "Bias and fairness"},
    Robustness: {label: "R", name: "Robustness"},
}

const QuestionTypes = 
{
    checkbox: "checkbox",
    radiogroup: "radiogroup"
}

var radarChartData = [];

export default class Results extends Component {





    DisplayQuestion(result, question){     
        var choices = question?.choices?.filter((choice) => result.includes(choice?.value));     
        return (
            <tr key={question?.name}>
                <td>
                    {question?.title?.default.split("\n").map(function(item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br/>
                            </span>
                        )
                    })}
                </td>
                <td>
                    {choices.map(choice => {
                        return (
                            choice?.text?.default.split("\n").map(function(item, idx) {
                                return (
                                    <span key={idx}>
                                        {item}
                                        <br/>
                                    </span>
                                )
                            })
                        )
                    })}
                </td>
                <td>
                    {question?.recommendation?.default.split("\n").map(function(item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br/>
                            </span>
                        )
                    })}
                </td>
            </tr>
        )
    }

    CreateReportCard(dimension, results, questions){
        return (
            <div className="report-card mt-3">
                <Table id={"report-card-"+ dimension} bordered responsive className="report-card-table">
                    <thead>
                        <tr role="row">
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Question
                                </div>
                            </th>
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Your Response
                                </div>
                            </th>
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Recommendation
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map(question => {
                            return this.DisplayQuestion(results[question?.name], question)
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }   

    CalculateDimensionScore(dimensionName, results, questions){
        var dimensionScore = 0;
        var maxDimensionScore = 0;
        questions.map(question => {
            var selectedChoices = results[question.name];
            var scores = question.score;
            if(question.type === QuestionTypes.checkbox){
                maxDimensionScore += scores.max;
                if(selectedChoices !== undefined){
                    var questionScore = 0
                    selectedChoices.map(choice => {
                        questionScore += scores?.choices[choice] ?? 0;
                        return dimensionScore;
                    })
                    if(questionScore > scores.max){
                        questionScore = scores.max;
                    }
                    dimensionScore += questionScore;
                }
                return dimensionScore;
            }
            else if(question.type === QuestionTypes.radiogroup){
                var maxScore = 0;
                Object.entries(scores.choices).map(choice => {
                    if(selectedChoices !== undefined){
                        if(choice[0] === selectedChoices){
                            dimensionScore += choice[1];
                        }
                    }
                    if(choice[1] > maxScore){
                        maxScore = choice[1];
                    }
                    return dimensionScore;
                });
                maxDimensionScore += maxScore;
            }
            return dimensionScore;
        });
        var percentageScore = (dimensionScore/maxDimensionScore)*100;
        radarChartData.push({"dimension": dimensionName, "score": percentageScore});
        return (
            <tr key={dimensionName}>
                <th scope="row" className="score-card-dimensions">{dimensionName}</th>
                <td className="text-center">
                    {(percentageScore < 50) 
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" />
                    }
                    
                </td>
                <td className="text-center">
                    {(percentageScore >= 50 && percentageScore <= 75)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" />
                    }       
                </td>
                <td className="text-center">
                    {(percentageScore > 75)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" />
                    }
                </td>
            </tr>
        )
    }

    render() {
        var json = this.props.location.state.questions;
        var surveyResults = this.props.location.state.responses;
        var pages = json["pages"];
        var allQuestions = [];
        pages.map(page => {
            allQuestions = allQuestions.concat(page?.elements);
            return allQuestions
        });
        var projectTitle = surveyResults[(allQuestions[0].name)];
        var projectDescription = surveyResults[(allQuestions[1].name)];
        var questions = allQuestions.filter((question) => Object.keys(surveyResults).includes(question.name))
    

        var unselected = "#dee2e6";
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                { projectTitle && <h1>{projectTitle}</h1> }
                { projectDescription && <p>{projectDescription}</p> }
                <h1 className="section-header">
                    Results
                </h1>
                <button id="saveButton" type="button" className="btn btn-save mr-2 btn btn-primary export-button" onClick={exportReport}>Export</button>
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
                                    {this.CalculateDimensionScore(Dimensions.Accountability.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Accountability.label))}
                                    {this.CalculateDimensionScore(Dimensions.Explainability.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Explainability.label ))}
                                    {this.CalculateDimensionScore(Dimensions.Data.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Data.label ))}
                                    {this.CalculateDimensionScore(Dimensions.Bias.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Bias.label ))}
                                    {this.CalculateDimensionScore(Dimensions.Robustness.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Robustness.label ))}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="report-card" title="Report Card">
                        <div>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="accountability">
                                <Tab.Content>
                                    <Tab.Pane eventKey="accountability" >
                                        {this.CreateReportCard(Dimensions.Accountability.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Accountability.label ))}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="explainability">
                                        {this.CreateReportCard(Dimensions.Explainability.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Explainability.label ))}                               
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="data-quality">     
                                        {this.CreateReportCard(Dimensions.Data.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Data.label ))}                              
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="bias-fairness">
                                        {this.CreateReportCard(Dimensions.Bias.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Bias.label ))}                                 
                                    </Tab.Pane>            
                                    <Tab.Pane eventKey="robustness">
                                        {this.CreateReportCard(Dimensions.Robustness.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Robustness.label ))}                                   
                                    </Tab.Pane>                                                                 
                                </Tab.Content>
                                <Nav variant="tabs" className="report-card-nav" defaultActiveKey="accountability">
                                    <Nav.Item>
                                        <Nav.Link eventKey="accountability">
                                            Accountability
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="explainability">
                                            Explainability
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="data-quality">
                                            Data quality and rights
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="bias-fairness">
                                            Bias and fairness
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="robustness">
                                            Robustness
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Tab.Container>
                        </div>
                    </Tab>
                </Tabs>
                <div className="dimension-chart">
                    <ResponsiveRadar
                        data={radarChartData}
                        keys={[ "score" ]}
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
                    <Button>Start Again</Button>
                </Link>
            </main>
        );
    }
}