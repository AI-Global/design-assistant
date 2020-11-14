import React, { Component } from 'react';
import { Tabs, Tab, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import ReactGa from 'react-ga';

ReactGa.initialize(process.env.REACT_APP_GAID);

const User = props => (
    <tr>
        <td>{props.user.email}</td>
        <td>{props.user.username}</td>
        <td>{props.user.role}</td>
        <td>
         <a href="#" onClick={() => { if (window.confirm('Are you sure you want to delete the user?')) {(props.deleteUser(props.user._id))} }}>Delete User</a>

        </td>
    </tr>
)

export default class Admin extends Component {
    constructor(props) {
        super(props);

        this.deleteUser = this.deleteUser.bind(this)

        this.state = {
            users: [],
            submissions: []

        };
    }

    componentDidMount(){
        ReactGa.pageview(window.location.pathname + window.location.search);
        var endPoint = '/questions';
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
        .then(res => {
            var json = res.data;
            // replace double escaped characters so showdown correctly renders markdown frontslashes and newlines
            var stringified = JSON.stringify(json);
            stringified = stringified.replace(/\\\\n/g, "\\n");
            stringified = stringified.replace(/\\\//g, "/");
            json = JSON.parse(stringified);
            this.setState({json: json});
        })


        axios.get('http://localhost:9000/users')
        .then(response => {
            this.setState({users: response.data})
            axios.get('http://localhost:9000/submissions')
            .then(response => {
                var resp = response.data;
                resp = resp.map(submission => {
                    submission.userId = this.state.users.filter(user => {return user.userId = submission.userId})[0].name;
                    return submission
                });
    
                this.setState({submissions: resp })
            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((error) => {
            console.log(error);
        })

    }
        
    nextPath(path, submission) {
        this.props.history.push({
          pathname: path,
          state:  {questions: this.state.json, responses: submission}
        })
      }

    deleteUser(id) {
        axios.delete('http://localhost:9000/users/'+id)
        .then(response => {console.log(response.data)});

        this.setState({
            users: this.state.users.filter(ul => ul._id !== id)
        })
    }

    userList() {
        return this.state.users.map(currentuser => {
            return <User user={currentuser} deleteUser={this.deleteUser} key={currentuser._id}/>;
        })
    }

    submissionList() {
        return this.state.submissions.map(currentsubmission => {
            return (
                <tr>
                    <td>{currentsubmission.userId}</td>
                    <td>{currentsubmission.projectName}</td>
                    <td>{currentsubmission.date}</td>
                    <td>{currentsubmission.lifecycle}</td>
                    <td>{String(currentsubmission.completed)}</td>
                    <td>
                        <Button size="sm" onClick={() => this.nextPath('/Results/', currentsubmission.submission)}>View Responses</Button>
                    </td>
                </tr>
            )
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
                                    <th className="score-card-headers">
                                            Email
                                        </th>
                                        <th className="score-card-headers">
                                            User Name
                                        </th>
                            
                                        <th className="score-card-headers">
                                            User Role
                                        </th>

                                        <th className="score-card-headers">
                                            Action
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {this.userList()}

                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="submissions" title="Submissions">
                        <div className="table-responsive mt-3">
                            <Table id="submissions" bordered hover responsive className="submission-table">
                                <thead>
                                    <tr>
                                    <th className="score-card-headers">
                                            User ID
                                        </th>
                                        <th className="score-card-headers">
                                            Project Name
                                        </th>

                                        <th className="score-card-headers">
                                            Date
                                        </th>

                                        <th className="score-card-headers">
                                            Lifecycle
                                        </th>
                                        <th className="score-card-headers">
                                            Completed
                                        </th>
                                        <th className="score-card-headers">
                                            Submissions
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {this.submissionList()}

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