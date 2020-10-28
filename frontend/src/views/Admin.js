import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Tabs, Tab, } from 'react-bootstrap';
import Table from '@material-ui/core/Table';

import QuestionTable from '../Components/QuestionTable'

//TODO: replace this with backend API to get JSONs from mongoDB
const questionsJSON = require('../questionsJSON.json')
// console.log(questionsJSON)

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: [],
            questions: []
        }
    }

    render() {
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">
                    Administration
                </h1>
                <Tabs defaultActiveKey="surveyManagement">
                    <Tab eventKey="surveyManagement" title="Survey Management">
                        <QuestionTable questions={questionsJSON} />
                    </Tab>
                    <Tab eventKey="userManagement" title="Users">
                        <div className="table-responsive mt-3">
                            <Table id="users" bordered="true" hover="true" responsive="true" className="user-table">
                                <thead>
                                    <tr>
                                        <th className="score-card-headers">
                                            No.
                                        </th>
                                        <th className="score-card-headers">
                                            User Name
                                        </th>
                                        <th className="score-card-headers">
                                            User Email
                                        </th>
                                        <th className="score-card-headers">
                                            User Type
                                        </th>
                                        <th className="score-card-headers">
                                            User Role
                                        </th>
                                        <th className="score-card-headers">
                                            User Submissions
                                        </th>
                                        <th className="score-card-headers">
                                            User Score
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Michael</td>
                                        <td>michaeljackson@pop.com</td>
                                        <td>Registered</td>
                                        <td>1</td>
                                        <td>
                                            <Link to='/Results'>
                                                <input type='button' value='View Responses' />
                                            </Link>
                                        </td>
                                        <td>95</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="analytics" title="Analytics">
                        <div className="table-responsive mt-3">
                            <Table id="analytics" bordered="true" hover="true" responsive="true" className="analytics-table">
                                <thead>
                                    <tr>
                                        <th className="score-card-headers">
                                            Analytics
                                        </th>
                                    </tr>
                                </thead>
                            </Table>
                        </div>
                    </Tab>
                </Tabs>
            </main>
        )
    }
}
