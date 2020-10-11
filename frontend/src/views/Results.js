import React, { Component } from 'react';
import * as Survey from "survey-react";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { Tabs, Tab, Table, Button, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons'
import "../css/theme.css"
import "../css/survey.css"
import { ResponsiveRadar } from 'nivo'

const Accountability = "A";
const Bias = "B";
const Data = "D";
const Explainability = "EI";
const Robustness = "R";

export default class Results extends Component {
    DisplayQuestion(result, question){     
        var choices = question?.choices?.filter((choice) => result.includes(choice?.value));     
        return (
            <tr key={question?.name}>
                <td>
                    {question?.title?.default}
                </td>
                <td>
                    {choices.map(choice => {
                        return (<p key={choice?.value}>{choice?.text?.default}</p>)
                    })}
                </td>
                <td>
                    {question?.recommendation?.default}
                </td>
            </tr>
        )
    }

    CreateReportCard(results, questions){
        return (
            <div className="report-card mt-3">
                <Table bordered responsive className="report-card-table">
                    <thead>
                        <tr role="row">
                            <th role="columnheader" scope="col" className="report-card-columns">
                                <div>
                                    Question
                                </div>
                            </th>
                            <th role="columnheader" scope="col" className="report-card-columns">
                                <div>
                                    Your Response
                                </div>
                            </th>
                            <th role="columnheader" scope="col" className="report-card-columns">
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

    CalculateScore(dimension, results, questions){
        return (
            <tr key={dimension}>
                <th scope="row">{dimension}</th>
                <td className="text-center">
                    <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" />
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" />
                </td>

            </tr>
        )
    }

    render() {
        var json = this.props.location.state 
        var surveyResults = {"QBAEDF":"Title ","QA02D4":"Description","Q8892C":"itemACE1FC","QFB449":"itemA99F90","Q62CB7":"itemA7A99E","QBA335":"itemAE9C4A","Q05AA0":["itemAE3D90","itemA27287"],"QCDD6C":"itemAB4ED7","QB09AA":"itemA8CE69","QE7CBC":["itemAABD4E","itemA7DF45"],"QE7848":"itemA52734","Q214D0":["itemAD6BCC","itemA3DDD3"],"QF211C":["itemA48BA0","itemA5DE57"],"QFABC6":"itemA2CA06","QFF34A":["itemA352B5","itemAE62E4"],"Q9463F":"itemA354A1","QB71A6":"itemAE6179","Q836F4":"itemA81097","QD85E8":"itemA96E95","Q4435F":"itemA89016","QA0F6A":["itemA4CF53","itemAAB8AD"],"Q71FC3":["itemA4C27A","itemA74430","itemADA33F"],"Q22F17":["itemAB015E","itemA83E75"],"Q56654":"itemAEEB13","Q1577E":["itemAA34FF","itemA2B090","itemA01B9E"],"Q4805F":["itemA3AB8E","itemAF42BB"],"QD3651":"itemA39EB2","QC8371":"itemAA5148","QC9FE9":"itemA34F49","Q1B4C3":"itemA6E936","Q41411":"itemA574CD","Q6B15A":["itemAB333A","itemA0A5A0"],"QC13B2":["itemA3E6DE","itemAA8F83"],"Q53BC0":"itemA794F6","Q1FB1A":"itemA82BB0","QE51EB":"itemADD756","Q4A201":["itemAA7355","itemA220E8"],"Q1CE3D":"itemAE4B46","QC9882":["itemA5D795","itemA1E1FE","itemADE566"],"Q4DF04":"itemAF7383","QF593F":"itemA23933","QFE3D1":"itemAD9B01","Q9B650":"itemAA1E40","QB3F92":"itemA45980","Q504B1":["itemA5335C","itemA10874"],"QA94E7":["itemAC88AB","itemA6DB38","itemA1C8F3","itemA4D2FA"],"QF1954":["itemAF25AF","itemA8351D"],"QA47B7":"itemA7084A","QBA6C6":["itemA5CD30","itemA95B49"],"Q7F9D0":"itemA8AE9E","Q69E03":"itemAFC5B0","Q3CFCB":"itemA87387","QD54A7":["itemA2AF6F","itemA0025B"],"Q79336":["itemA1B141"],"Q61060":["itemAF8C49","itemA12CD2"],"Q9049E":["itemAD5CFD","itemAD0DD1","itemAB4834"],"Q466C3":"itemA47278","QFE677":"itemAFE12B","Q1F036":"itemAE1DC0","QB463D":["itemA6245C","itemAB9922"],"Q88620":"itemA04694","Q8391A":["itemA16D8D","itemABEB5B"],"QB683F":"itemA9932B","Q34ACA":"itemA52CB6","QF9104":"itemAD6779","QBEA4F":["itemA1BBB7","itemA3C935","itemA7B9D6"],"Q2BDD8":"itemA62CF2","Q1DAE3":["itemADAE6F"],"Q70823":["itemA0C4D4","itemAE9879"],"QD3128":["itemAB7B6F"],"QFD79B":["itemAD497E"],"QFD3A6":["itemA46F9C","itemA359A4"],"QFF2A8":["itemA1B01B"],"Q3EFF7":["itemA4ED34","itemAC87E6"]};
        var pages = json["pages"]
        var allQuestions = [];
        pages.map(page => {
            allQuestions = allQuestions.concat(page?.elements);
            return allQuestions
        });
        var questions = allQuestions.filter((question) => Object.keys(surveyResults).includes(question.name))
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">Results
                </h1>
                <Tabs defaultActiveKey="score">
                    <Tab eventKey="score" title="Score">
                        <div className="table-responsive mt-3">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>
                                            Dimensions
                                        </th>
                                        <th>
                                            Needs to improve
                                        </th>
                                        <th>
                                            Acceptable
                                        </th>
                                        <th>
                                            Proficient
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.CalculateScore("Accountability", surveyResults, questions.filter(x => x.score?.dimension === Accountability ))}
                                    {this.CalculateScore("Explainability", surveyResults, questions.filter(x => x.score?.dimension === Explainability ))}
                                    {this.CalculateScore("Data quality and rights", surveyResults, questions.filter(x => x.score?.dimension === Data ))}
                                    {this.CalculateScore("Bias and fairness", surveyResults, questions.filter(x => x.score?.dimension === Bias ))}
                                    {this.CalculateScore("Robustness", surveyResults, questions.filter(x => x.score?.dimension === Robustness ))}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="report-card" title="Report Card">
                        <div>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="accountability">
                                <Tab.Content>
                                    <Tab.Pane eventKey="accountability" >
                                        {this.CreateReportCard(surveyResults, questions.filter(x => x.score?.dimension === Accountability ))}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="explainability">
                                        {this.CreateReportCard(surveyResults, questions.filter(x => x.score?.dimension === Explainability ))}                               
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="data-quality">     
                                        {this.CreateReportCard(surveyResults, questions.filter(x => x.score?.dimension === Data ))}                              
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="bias-fairness">
                                        {this.CreateReportCard(surveyResults, questions.filter(x => x.score?.dimension === Bias ))}                                 
                                    </Tab.Pane>            
                                    <Tab.Pane eventKey="robustness">
                                        {this.CreateReportCard(surveyResults, questions.filter(x => x.score?.dimension === Robustness ))}                                   
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