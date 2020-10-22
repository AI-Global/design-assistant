import React, { Component } from 'react';
import { Tabs, Tab, Table, } from 'react-bootstrap';
// import App from '../App';
import axios from 'axios';

import { Link } from 'react-router-dom';

export default class Results extends Component {
    // Request questions JSON from backend 
    constructor(props) {
        super(props);
        this.state = {
            questions: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:9000/questions')
            .then(res => {
                var json = res.data;
                // replace double escaped characters so showdown correctly renders markdown frontslashes and newlines
                var stringified = JSON.stringify(json);
                stringified = stringified.replace(/\\\\n/g, "\\n");
                stringified = stringified.replace(/\\\//g, "/");
                json = JSON.parse(stringified);
                var questions = [];
                for (var i = 0; i < json.pages.length; i++) {
                    // console.log(pages[i]);
                    for (var j = 0; j < json.pages[i].elements.length; j++) {
                        if (json.pages[i].elements[j].title.default !== 'Other:') {
                            //console.log(json.pages[i].elements[j].title.default) //pages[i].elements[j].type, pages[i].elements[j].choices);
                            questions.push(json.pages[i].elements[j].title.default)
                        }
                    }
                }
                this.setState({ questions })
            })
    }

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
                                            Question
                                        </th>
                                    </tr>
                                </thead>
                                {this.state.questions.map((question, index) => {
                                    return (
                                        <tbody key={index}>
                                            <tr>
                                                <td>{question}</td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="userManagement" title="Users">
                        <div className="table-responsive mt-3">
                            <Table id="users" bordered hover responsive className="user-table">
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
                            <Table id="analytics" bordered hover responsive className="analytics-table">
                            </Table>
                        </div>
                    </Tab>
                </Tabs>
            </main>

        )
    }
}
