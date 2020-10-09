import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { Tabs, Tab, Table, Button, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons'
import "../css/theme.css"


export default class Results extends Component {


    render() {
        var json = this.props.location.state 
        var unselected = "#dee2e6";
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" class="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">Results</h1>
                <Tabs>
                    <Tab eventKey="score" title="Score">
                        <div class="table-responsive mt-3">
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
                                    <tr>
                                        <th scope="row">
                                            Accountability
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            Explainability
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            Data quality and rights
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            Bias and fairness
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            Robustness
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected} />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="report-card" title="Report Card">
                        <div class="table-responsive">
                            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                <Tab.Content>
                                    <Tab.Pane eventKey="accountability" >
                                        <Table>
                                            <thead>
                                                <tr role="row" >
                                                    <th role="columnheader" scope="col" >
                                                        <div>
                                                            Question
                                                        </div>
                                                    </th>
                                                    <th role="columnheader" scope="col" >
                                                        <div>
                                                            Your Response
                                                        </div>
                                                    </th>
                                                    <th role="columnheader" scope="col" >
                                                        <div>
                                                            Recommendation
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </Table>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        hi
                                    </Tab.Pane>
                                </Tab.Content>
                                <Nav variant="tabs" defaultActiveKey="accountability">
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