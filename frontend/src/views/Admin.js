import React, { Component } from 'react';
import { Tabs, Tab, Table, } from 'react-bootstrap';

export default class Results extends Component {
    render() {
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">
                    Administration
                </h1>
                <Tabs defaultActiveKey="surveyManagement">
                    <Tab eventKey="surveyManagement" title="Survey Management">
                        <div className="table-responsive mt-3">
                            <Table id="questions" bordered hover responsive className="question-table">
                                <thead>
                                    <tr>
                                        <th className="score-card-headers">
                                            No.
                                        </th>
                                        <th className="score-card-headers">
                                            Question
                                        </th>
                                        <th className="score-card-headers">
                                            Type
                                        </th>
                                        <th className="score-card-headers">
                                            Responses
                                        </th>
                                        <th className="score-card-headers">
                                            Help Text
                                        </th>
                                        <th className="score-card-headers">
                                            Domain
                                        </th>
                                        <th className="score-card-headers">
                                            Role
                                        </th>
                                        <th className="score-card-headers">
                                            Points
                                        </th>
                                        <th className="score-card-headers">
                                            Weighting
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Here is a question.</td>
                                        <td>Radio</td>
                                        <td>No, Yes, Maybe</td>
                                        <td>Help alt-text</td>
                                        <td>Accountability</td>
                                        <td>All</td>
                                        <td>3</td>
                                        <td>2</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Here is another question.</td>
                                        <td>Slider</td>
                                        <td>N/A</td>
                                        <td>N/A</td>
                                        <td>Bias and Fairness</td>
                                        <td>All</td>
                                        <td>1</td>
                                        <td>1</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="userManagement" title="Users">
                        <div className="table-responsive mt-3">
                            <Table id="users" bordered hover responsive className="user-table">
                                <thead>
                                    <tr>

                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="analytics" title="Analytics">
                        <div className="table-responsive mt-3">
                            <Table id="analytics" bordered hover responsive className="analytics-table">
                            </Table>
                        </div>
                    </Tab>
                </Tabs>
            </main>

        )
    }
}
