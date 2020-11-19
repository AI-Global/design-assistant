import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { getLoggedInUser } from '../helper/AuthHelper'
import axios from 'axios';
import ReactGa from 'react-ga';
import { withRouter } from 'react-router-dom';

const StartSurveyHandler = () => {
    ReactGa.event({
        category: 'Button',
        action: 'Clicked the Start Survey Button'
    })
}

class UserSubmissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSubmissionIdx: 0,
            authToken: localStorage.getItem("authToken"),
            submissions: []
        };
    }


    componentDidMount() {
        getLoggedInUser().then(user => {
            if (user) {
                var endPoint = '/submissions/user/' + user._id;
                this.setState({ user: user });
                axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
                    .then(res => {
                        var submissions = res.data;
                        this.setState(submissions);
                    });
            }
        });
    }

    startSurvey() {
        // initialize and save new submission (blank)
        // append to state.submissions
        // set index to point to this submission

        // how to get projectName of the survey?
        // and if we get project name 

        let user = this.state.user;
        let submission = {};
        let dateTime = new Date();

        var endPoint = '/submissions/';
        axios.post(process.env.REACT_APP_SERVER_ADDR + endPoint, {
            userId: user?._id ?? null,
            projectName: "",
            date: dateTime,
            lifecycle: 6,
            submission: submission,
            completed: false
        })
            .then(res => {
                // update this.state.submissions object here
                let newSubmission = res.data;
                let submissions = this.state.submissions;
                submissions.push(newSubmission);
                this.setState({ submissions: submissions })
                this.setState({ currentSubmissionIdx: this.state.submissions.length - 1 });
                // push to survey route and pass new submission_is so progress can be saved
                this.props.history.push({
                    pathname: '/DesignAssistantSurvey',
                    state: { submission_id: res.data._id }
                })

            });
    }

    resumeSurvey(index) {

        // This is important because save relies on this index being updated
        this.setState({ currentSubmissionIdx: index });
        let submission = this.state.submissions[index];

        if (submission.completed) {
            // If survey is completed we need to pass submission repsonses and questions to results page
            // so we need to make a API call to get questions here
            var endPoint = '/questions';
            var json
            axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
                .then(res => {
                    json = res.data;
                    // replace double escaped characters so showdown correctly renders markdown frontslashes and newlines

                    //TODO: Might be able ro remove this block of code when #177 (markdown render) is resolved
                    var stringified = JSON.stringify(json);
                    stringified = stringified.replace(/\\\\n/g, "\\n");
                    stringified = stringified.replace(/\\\//g, "/");
                    json = JSON.parse(stringified);
                    //

                    this.props.history.push({
                        pathname: '/Results',
                        state: { questions: json, responses: submission.submission }
                    })
                })
        }
        else {
            // If survey is not completed, pass previous submissions so SurveyJS can load them into the model
            // so user can continue 
            this.props.history.push({
                pathname: '/DesignAssistantSurvey',
                state: { prevResponses: submission.submission, submission_id: submission._id }
            })
        }
    }

    cloneSurvey(index) {
        let submission = this.state.submissions[index];
        let user = this.state.user;
        let dateTime = new Date();
        var endPoint = '/submissions/';
        axios.post(process.env.REACT_APP_SERVER_ADDR + endPoint, {
            userId: user?._id ?? null,
            projectName: submission?.projectName,
            date: dateTime,
            lifecycle: 6,
            submission: submission?.submission,
            completed: false
        })
            .then(res => {
                // update this.state.submissions object here
                let newSubmission = res.data;
                let submissions = this.state.submissions;
                submissions.unshift(newSubmission);
                this.setState({ submissions: submissions })
                this.setState({ currentSubmissionIdx: this.state.submissions.length - 1 });
            });
    }
    render() {
        return (
            <div>
                <div>
                    <div className="card">
                        <div className="card-header">Continue existing survey</div>
                        <div className="card-body">
                            <Table bordered responsive className="survey-results-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Project Name
                                        </th>
                                        <th>
                                            Last Updated
                                        </th>
                                        <th width="175px"></th>
                                        <th width="192px"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.submissions.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {value?.projectName ? value?.projectName : "No Project Name"}
                                                </td>
                                                <td>
                                                    {new Date(value.date).toLocaleString('en-US', { timeZone: Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ?? 'UTC' })}
                                                </td>
                                                <td width="175px" className="text-center">
                                                    {!value.completed &&
                                                        <Button block onClick={() => { this.resumeSurvey(index); StartSurveyHandler() }} >Resume Survey</Button>}
                                                    {value.completed &&
                                                        <Button id="ResultsButton" block onClick={() => { this.resumeSurvey(index); StartSurveyHandler() }} >Survey Results</Button>}
                                                </td>
                                                <td width="175px">
                                                    <Button block onClick={() => { this.cloneSurvey(index) }}>Clone</Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className="float-right mr-3 mt-2">
                    <Button onClick={() => this.startSurvey()}>Start New Survey</Button>
                </div>
            </div>
        );
    }
}

export default withRouter(UserSubmissions);