import '../css/admin.css';
import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import QuestionTable from '../Components/QuestionTable';
import AnalyticsDashboard from '../Components/AnalyticsDashboard';
import AdminProviders from '../Components/AdminProviders';
import AdminResources from '../Components/AdminResources';
import { Tabs, Tab, Button, Table as BootStrapTable, DropdownButton, Dropdown, Form } from 'react-bootstrap';
import { getLoggedInUser } from '../helper/AuthHelper';
import ReactGa from 'react-ga';
import axios from 'axios';
import Login from './Login';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom';


ReactGa.initialize(process.env.REACT_APP_GAID, { testMode: process.env.NODE_ENV === 'test' });

const User = props => (
    <tr>
        <td style={{textAlign:"center"}}>{props.user.email}</td>
        <td style={{textAlign:"center"}}>{props.user.username}</td>
        <td style={{textAlign:"center"}}>
            {(props.role === "superadmin") ?
                <DropdownButton id="dropdown-item-button" title={props.user.role}>
                    <Dropdown.Item onClick={props.changeRole.bind(this, props.user._id, "member")} >Member</Dropdown.Item>
                    <Dropdown.Item onClick={props.changeRole.bind(this, props.user._id, "mod")} >Mod</Dropdown.Item>
                    <Dropdown.Item onClick={props.changeRole.bind(this, props.user._id, "admin")} >Admin</Dropdown.Item>
                    <Dropdown.Item onClick={props.changeRole.bind(this, props.user._id, "superadmin")} >Super Admin</Dropdown.Item>
                </DropdownButton>
                : props.user.role}

        </td>
        <td style={{textAlign:"center"}}>{props.user?.organization}</td>
        <td align ="center">
        <Link to={"/ViewSubmissions/"+props.user._id}> <Button size="sm">Submissions</Button> </Link> </td>
        <td align ="center"> <IconButton size="small" color="secondary" onClick={() => 
            { var conf = window.confirm('Are you sure you want to delete the user?');
                if (conf == true) 
            { var conf = window.confirm('Would you like to delete all the submissions from this user?');
                if(conf == true)
                {
                    {(props.deleteUserSubmission(props.user._id))}
                    {(props.deleteUser(props.user._id))}
                    window.alert("User and their submissions are deleted.")
                }
                else
                {
                    var conf = window.confirm('Would you just like to delete the user and keep their submission?');

                    if (conf == true)
                    {
                    (props.deleteUser(props.user._id))
                    window.alert("User deleted.")
                    }
                }
            }
            }}><DeleteIcon style={{ color: red[500] }}/> </IconButton></td>
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
            submissions: [],
            showFilter: false,
            orgFilter: "",
            roleFilter: ""

        };
        this.handleTabChange = this.handleTabChange.bind(this);
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
    deleteSubmission(id) {
        let endPoint = '/submissions/delete/' + id;
        axios.delete(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(response => { console.log(response.data) });

        this.setState({
            submissions: this.state.submissions.filter(ul => ul._id !== id)
        })
    }
    deleteUserSubmission(id) {
        let endPoint = '/submissions/deleteAll/' + id;
        axios.delete(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(response => { console.log(response.data) });

        this.setState({
            submissions: this.state.submissions.filter(ul => ul._id !== id)
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
                if (this.state.roleFilter === "" || currentuser.role?.toLowerCase() === this.state.roleFilter?.toLowerCase())
                    if (this.state.orgFilter === "" || currentuser.organization?.toLowerCase() === this.state.orgFilter?.toLowerCase())
                        return <User user={currentuser} deleteUser={this.deleteUser} deleteUserSubmission={this.deleteUserSubmission} changeRole={this.changeRole} role={this.role} key={currentuser._id} />;
                return null;
            })
        }
    }

    submissionList() {
        return this.state.submissions.map((currentsubmission, idx) => {
            let convertedDate = new Date(currentsubmission.date).toLocaleString("en-US", { timeZone: Intl.DateTimeFormat()?.resolvedOptions()?.timeZone ?? "UTC" });
            return (
                <tr key={idx}>
                    <td style={{textAlign:"center"}}>{currentsubmission.userId}</td>
                    <td style={{textAlign:"center"}}>{currentsubmission.projectName}</td>
                    <td style={{textAlign:"center"}}>{convertedDate}</td>
                    <td style={{textAlign:"center"}}>{currentsubmission.completed ? "Yes" : "No"}</td>
                    <td style={{textAlign:"center"}}><Button size="sm" onClick={() => this.nextPath('/Results/', currentsubmission.submission ?? {})}>View Responses</Button></td> 
                    <td align ="center"> <IconButton size="small" color="secondary" onClick={() => { if (window.confirm('Are you sure you want to delete the submission?')) { (this.deleteSubmission(currentsubmission._id)) } }}><DeleteIcon style={{ color: red[500] }}/> </IconButton></td>
                </tr>
            )
        })
    }

    handleTabChange(key) {
        if (key === "userManagement") {
            this.setState({ showFilter: true });
        } else {
            this.setState({ showFilter: false });
        }
    }

    resetFilters(event) {
        this.setState({ orgFilter: "", roleFilter: "" });
        event.target.reset();
    }

    handleFilters(event) {
        event.preventDefault();
        let form = event.target.elements;
        let orgFilter = form.orgFilter.value;
        let roleFilter = form.roleFilter.value;
        this.setState({ orgFilter: orgFilter, roleFilter: roleFilter });


    }

    render() {
        return (
            <div>
                <div className="dimensionNav">
                    {!this.state.showFilter ? null :
                        <Accordion>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey='1'>
                                    Filters
                    </Accordion.Toggle>
                                <Accordion.Collapse eventKey='1'>
                                    <Card.Body className="cardBody">
                                        <Form onSubmit={(e) => this.handleFilters(e)} onReset={(e) => this.resetFilters(e)}>
                                            <Form.Group controlId="roleFilter">
                                                <Form.Label>Role</Form.Label>
                                                <Form.Control type="text" placeholder="Role Name" />
                                            </Form.Group>
                                            <Form.Group controlId="orgFilter">
                                                <Form.Label>Organization</Form.Label>
                                                <Form.Control type="text" placeholder="Organization Name" />
                                            </Form.Group>
                                            <Form.Group controlId="formSubmit">
                                            </Form.Group>
                                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Submit" />
                                            <Button type="reset" id="clearFilter"><div>Reset <i className="fa fa-undo fa-fw"></i></div></Button>
                                        </Form>

                                    </Card.Body>

                                </Accordion.Collapse>

                            </Card>
                        </Accordion>
                    }
                </div>
                <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                    <h1 className="section-header">
                        Administration Panel
                </h1>
                    <Tabs defaultActiveKey="surveyManagement" onSelect={this.handleTabChange}>
                        <Tab eventKey="surveyManagement" title="Survey Management">
                            <QuestionTable />
                        </Tab>
                        <Tab eventKey="userManagement" title="Users">
                            <div className="table-responsive mt-3">
                                <BootStrapTable id="users" bordered hover responsive className="user-table">
                                    <thead>
                                        <tr>
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                Email
                                        </th>
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                User Name
                                        </th>
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                User Role
                                        </th>
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                User Organization
                                        </th>
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                               
                                        </th>
                                        <th className="score-card-headers" style={{textAlign:"center"}}>
                                               
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
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                User Name
                                        </th>
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                Project Name
                                        </th>
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                Date
                                        </th>

                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                Completed
                                        </th>
                                            <th className="score-card-headers" style={{textAlign:"center"}}>
                                                Responses
                                        </th>
                                        <th className="score-card-headers" style={{textAlign:"center"}}>
                                                Action
                                        </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.submissionList()}

                                    </tbody>
                                </BootStrapTable>
                            </div>
                        </Tab>
                        <Tab eventKey="trustedAIProviders" title="Trusted AI Providers">
                        <AdminProviders/>
                        </Tab>
                        <Tab eventKey="trustedAIResources" title="Trusted AI Resources">
                            <AdminResources/>
                        </Tab>
                        <Tab eventKey="analytics" title="Analytics">
                            <AnalyticsDashboard />
                        </Tab>
                    </Tabs>
                    <Login />
                </main>
            </div>
        )
    }
}