import React, { Component } from 'react';
import axios from 'axios';
import {Button, Table as BootStrapTable} from 'react-bootstrap';
import ReactGa from 'react-ga';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { red } from '@material-ui/core/colors';
import DeleteSubmissionModal from '../Components/DeleteSubmissionModal';


ReactGa.initialize(process.env.REACT_APP_GAID, { testMode: process.env.NODE_ENV === 'test' });


export default class ViewSubmissions extends Component {

    constructor(props) {
        super(props);
        this.deleteSubmission = this.deleteSubmission.bind(this)
        this.showDeleteSubmisionModal = this.showDeleteSubmisionModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.confirmDeleteSubmission = this.confirmDeleteSubmission.bind(this)

        this.state = {
            submissions: [],
            users: [],
            showDeleteSubmissionModal: false,
            submissionToDelete: null
        };
    }

    componentDidMount() {
        const path = window.location.pathname.split('/')
        const id = path[path.length - 1]

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
                    endPoint = '/submissions/user/' + id
                    axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
                        .then(response => {
                            var resp = response.data.submissions;
                            resp = resp.map(submission => {
                                submission.username = this.state.users.find(user => user._id === submission.userId)?.username ?? "No User";
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

    deleteSubmission(id) {
        let endPoint = '/submissions/delete/' + id;
        axios.delete(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(response => { console.log(response.data) });

        this.setState({
            submissions: this.state.submissions.filter(ul => ul._id !== id)
        })
    }

    showDeleteSubmisionModal(submission) {
        this.setState({ submissionToDelete: submission, showDeleteSubmissionModal: true });
    }

    hideModal() {
        this.setState({submissionToDelete: null, showDeleteSubmissionModal: false });
    }

    confirmDeleteSubmission(){
        this.deleteSubmission(this.state.submissionToDelete._id);
        this.hideModal();
    }

    submissionList() {
        return this.state.submissions.map((currentsubmission, idx) => {
            let convertedDate = new Date(currentsubmission.date).toLocaleString("en-US", { timeZone: Intl.DateTimeFormat()?.resolvedOptions()?.timeZone ?? "UTC" });
            return (
                <tr key={idx}>
                    <td style={{ textAlign: "center" }}>{currentsubmission.username}</td>
                    <td style={{ textAlign: "center" }}>{currentsubmission.projectName}</td>
                    <td style={{ textAlign: "center" }}>{convertedDate}</td>
                    <td style={{ textAlign: "center" }}>{currentsubmission.completed ? "Yes" : "No"}</td>
                    <td align ="center"> <Button size="sm" onClick={() => this.nextPath('/Results/', currentsubmission.submission ?? {})}> Responses</Button> </td>
                    <td align ="center"> <IconButton size="small" color="secondary" onClick={() => { this.showDeleteSubmisionModal(currentsubmission)}}><DeleteIcon style={{ color: red[500] }}/> </IconButton></td>
                </tr>
            )
        })
    }




    render() {
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <DeleteSubmissionModal onHide={this.hideModal} confirmDelete={this.confirmDeleteSubmission} show={this.state.showDeleteSubmissionModal} submission={this.state?.submissionToDelete} />
                <h1 className="section-header">
                    Administration
                </h1>

                <div className="table-responsive mt-3">
                    <BootStrapTable id="submissions" bordered hover responsive className="submission-table">
                        <thead>
                            <tr>
                                <th className="score-card-headers" style={{ textAlign: "center" }}>
                                    User Name
                                        </th>
                                <th className="score-card-headers" style={{ textAlign: "center" }}>
                                    Project Name
                                        </th>

                                <th className="score-card-headers" style={{ textAlign: "center" }}>
                                    Date
                                        </th>
                                <th className="score-card-headers" style={{ textAlign: "center" }}>
                                    Completed
                                        </th>
                                <th className="score-card-headers" style={{ textAlign: "center" }}>
                                    Responses
                                        </th>
                                <th className="score-card-headers" style={{ textAlign: "center" }}>
                                    Action
                                        </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.submissionList()}
                        </tbody>
                    </BootStrapTable>
                </div>
            </main>

        )
    }
}