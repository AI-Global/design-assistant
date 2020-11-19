import '../css/admin.css';
import React, { Component } from 'react';
import QuestionTable from '../Components/QuestionTable';
import AnalyticsDashboard from '../Components/AnalyticsDashboard';
import { Tabs, Tab, Button, Table as BootStrapTable, DropdownButton, Dropdown } from 'react-bootstrap';
import { getLoggedInUser } from '../helper/AuthHelper';
import ReactGa from 'react-ga';
import axios from 'axios';

ReactGa.initialize(process.env.REACT_APP_GAID, { testMode: process.env.NODE_ENV === 'test' });

const User = props => (
    <tr>
        <td>{props.user.email}</td>
        <td>{props.user.username}</td>
        <td>

            {(props.role === "superadmin") ?
                <DropdownButton id="dropdown-item-button" title={props.user.role}>
                    <Dropdown.Item onClick={props.changeRole.bind(this, props.user._id, "member")} >Member</Dropdown.Item>
                    <Dropdown.Item onClick={props.changeRole.bind(this, props.user._id, "mod")} >Mod</Dropdown.Item>
                    <Dropdown.Item onClick={props.changeRole.bind(this, props.user._id, "admin")} >Admin</Dropdown.Item>
                    <Dropdown.Item onClick={props.changeRole.bind(this, props.user._id, "superadmin")} >Super Admin</Dropdown.Item>
                </DropdownButton>
                : props.user.role}

        </td>
        <td>
            <a href="#" onClick={() => { if (window.confirm('Are you sure you want to delete the user?')) { (props.deleteUser(props.user._id)) } }}>Delete User</a>

        </td>
    </tr>
)

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.deleteUser = this.deleteUser.bind(this)
        this.changeRole = this.changeRole.bind(this)
        this.role = undefined

        this.state = {
            users: [],
            submissions: []

        };
    }

    componentDidMount() {
        getLoggedInUser().then(user => {
            this.role = user.role;
        })

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
                this.setState({ json: json });
            })


        endPoint = '/users';
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(response => {
                this.setState({ users: response.data })
                endPoint = '/submissions'
                axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
                    .then(response => {
                        var resp = response.data;
                        resp = resp.map(submission => {
                            submission.userId = this.state.users.find(user => user._id === submission.userId)?.username ?? "No User";
                            return submission
                        });

                        this.setState({ submissions: resp })
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
            state: { questions: this.state.json, responses: submission }
        })
    }

    deleteUser(id) {
        let endPoint = '/users/' + id;
        axios.delete(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(response => { console.log(response.data) });

        this.setState({
            users: this.state.users.filter(ul => ul._id !== id)
        })
    }


    changeRole(id, role) {
        let endPoint = '/users/' + id;
        axios.put(process.env.REACT_APP_SERVER_ADDR + endPoint, { "role": role })
            .then(response => {
                this.state.users.find(user => user._id === response.data._id).role = role
                this.setState({
                    users: this.state.users
                })
            });
    }

    userList() {
        if (Array.isArray(this.state.users)) {
            return this.state.users.map(currentuser => {
                return <User user={currentuser} deleteUser={this.deleteUser} changeRole={this.changeRole} role={this.role} key={currentuser._id} />;
            })
        }
    }

    submissionList() {
        return this.state.submissions.map((currentsubmission, idx) => {
            let convertedDate = new Date(currentsubmission.date).toLocaleString("en-US", { timeZone: Intl.DateTimeFormat()?.resolvedOptions()?.timeZone ?? "UTC" });
            return (
                <tr key={idx}>
                    <td>{currentsubmission.userId}</td>
                    <td>{currentsubmission.projectName}</td>
                    <td>{convertedDate}</td>
                    <td>{currentsubmission.lifecycle}</td>
                    <td>{currentsubmission.completed ? "Yes" : "No"}</td>
                    <td>
                        <Button size="sm" onClick={() => this.nextPath('/Results/', currentsubmission.submission ?? {})}>View Responses</Button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">
                    Administration Panel
                </h1>
                <Tabs defaultActiveKey="surveyManagement">
                    <Tab eventKey="surveyManagement" title="Survey Management">
                        <QuestionTable />
                    </Tab>
                    <Tab eventKey="userManagement" title="Users">
                        <div className="table-responsive mt-3">
                            <BootStrapTable id="users" bordered hover responsive className="user-table">
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
                            </BootStrapTable>
                        </div>
                    </Tab>
                    <Tab eventKey="submissions" title="Submissions">
                        <div className="table-responsive mt-3">
                            <BootStrapTable id="submissions" bordered hover responsive className="submission-table">
                                <thead>
                                    <tr>
                                        <th className="score-card-headers">
                                            User Name
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
                            </BootStrapTable>
                        </div>
                    </Tab>
                    <Tab eventKey="analytics" title="Analytics">
                        <AnalyticsDashboard />
                    </Tab>
                </Tabs>
            </main>

        )
    }
}