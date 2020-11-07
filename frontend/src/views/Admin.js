import React, { Component } from 'react';
import { Tabs, Tab, Table, } from 'react-bootstrap';
import axios from 'axios';

const User = props => (
    <tr>
        <td>{props.user.email}</td>
        <td>{props.user.username}</td>
        <td>{props.user.role}</td>
        <td>
         <a href="#" onClick={() => { props.deleteUser(props.user._id) }}>Delete User</a>
        </td>
    </tr>
)

export default class Users extends Component {

    constructor(props) {
        super(props);

        this.deleteUser = this.deleteUser.bind(this)

        this.state = {users: []};
    }

    componentDidMount(){
        axios.get('http://localhost:9000/users/all')
        .then(response => {
            this.setState({users: response.data})
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deleteUser(id) {
        axios.delete('http://localhost:9000/users/all'+id)
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
