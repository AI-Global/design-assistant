import React, { Component } from 'react';
import { Tabs, Tab, Table, } from 'react-bootstrap';
import axios from 'axios';


const Submission = props => (
    <tr>
        
        <td>     
        {
        Object.keys(props.submission.submission).map((key, i) => (
          <tr key={i}>
            <td>Question: {key}</td>
            <td>Response: {props.submission.submission[key]}</td>
          </tr>
        ))
        
    }
        </td>
    </tr>
)

export default class ViewSubmissions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            submissions: {}

        };
    }

    componentDidMount(){
        
        axios.get('http://localhost:9000/submissions/'+this.props.match.params.id)
        .then(response => {
            this.setState({submissions: response.data})
        })
        .catch((error) => {
            console.log(error);
        })
    }

    submissionList() {
        return this.state.submissions.map(currentsubmission => {
            return <Submission submission={currentsubmission} key={currentsubmission._id}/>;
        })
    }


    render() {
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">
                    Administration
                </h1>
                
                        <div className="table-responsive mt-3">
                            <Table id="submissions" bordered hover responsive className="submission-table">
                                <thead>
                                    <tr>
                                        <th className="score-card-headers">
                                            Submissions
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {this.submissionList}
                                </tbody>
                            </Table>
                        </div>
            </main>

        )
    }
}