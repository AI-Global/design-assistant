import '../css/admin.css';
import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import QuestionTable from '../Components/QuestionTable';
import AnalyticsDashboard from '../Components/AnalyticsDashboard';
import AdminProviders from '../Components/AdminProviders';
import AdminResources from '../Components/AdminResources';
import {
  Tabs,
  Tab,
  Button,
  DropdownButton,
  Dropdown,
  Form,
} from 'react-bootstrap';
import { getLoggedInUser } from '../helper/AuthHelper';
import ReactGa from 'react-ga';
import api from '../api';
import Login from './Login';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import DeleteUserModal from '../Components/DeleteUserModal';
import DeleteSubmissionModal from '../Components/DeleteSubmissionModal';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit as faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import Signup from './Signup';
ReactGa.initialize(process.env.REACT_APP_GAID, {
  testMode: process.env.NODE_ENV !== 'production',
});

const User = (props) => (
  <TableRow>
    <TableCell>{null}</TableCell>
    <TableCell style={{ textAlign: 'left' }}>{props.user.email}</TableCell>
    <TableCell style={{ textAlign: 'left' }}>{props.user.username}</TableCell>
    <TableCell style={{ textAlign: 'left' }}>
      {props.user?.organization}
    </TableCell>
    <TableCell style={{ textAlign: 'center' }}>
      {props.role === 'superadmin' ? (
        <DropdownButton id="dropdown-item-button" title={props.user.role}>
          <Dropdown.Item
            onClick={props.changeRole.bind(this, props.user._id, 'member')}
          >
            Member
          </Dropdown.Item>
          <Dropdown.Item
            onClick={props.changeRole.bind(this, props.user._id, 'mod')}
          >
            Mod
          </Dropdown.Item>
          <Dropdown.Item
            onClick={props.changeRole.bind(this, props.user._id, 'admin')}
          >
            Admin
          </Dropdown.Item>
          <Dropdown.Item
            onClick={props.changeRole.bind(this, props.user._id, 'superadmin')}
          >
            Super Admin
          </Dropdown.Item>
        </DropdownButton>
      ) : (
        props.user.role
      )}
    </TableCell>
    <TableCell align="center">
      <Button
        size="sm"
        onClick={() => props.nextPath('/ViewSubmissions/' + props.user._id)}
      >
        View
      </Button>
    </TableCell>
    <TableCell align="center">
      <IconButton
        size="small"
        style={{ paddingTop: '0.60em' }}
        color="secondary"
        onClick={() => props.showModal(props.user)}
      >
        <DeleteIcon style={{ color: red[500] }} />{' '}
      </IconButton>
    </TableCell>
  </TableRow>
);

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);

    this.deleteUser = this.deleteUser.bind(this);
    this.deleteUserSubmission = this.deleteUserSubmission.bind(this);
    this.deleteSubmission = this.deleteSubmission.bind(this);
    this.changeRole = this.changeRole.bind(this);
    this.nextPath = this.nextPath.bind(this);
    this.enterSurvey = this.enterSurvey.bind(this);
    this.showDeleteUserModal = this.showDeleteUserModal.bind(this);
    this.showDeleteSubmisionModal = this.showDeleteSubmisionModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.confirmDeleteUser = this.confirmDeleteUser.bind(this);
    this.confirmDeleteSubmission = this.confirmDeleteSubmission.bind(this);
    this.role = undefined;
    this.userID = undefined
    this.state = {
      users: [],
      submissions: [],
      showUsersFilter: false,
      showSubmissionFilter: false,
      orgFilter: '',
      roleFilter: '',
      userFilter: '',
      projectFilter: '',
      showDeleteSubmissionModal: false,
      showDeleteUserModal: false,
      userToDelete: null,
      submissionToDelete: null,
      usersPage: 0,
      usersRowsPerPage: 10,
      usersCount: 0,
      submissionsPage: 0,
      submissionsCount: 0,
      submissionsRowsPerPage: 10,
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentDidMount() {
    getLoggedInUser().then((user) => {
      this.role = user.role;
      this.userID = user._id;
    });

    ReactGa.pageview(window.location.pathname + window.location.search);
    api.get('questions').then((res) => {
      var json = res.data;
      // replace double escaped characters so showdown correctly renders markdown frontslashes and newlines
      var stringified = JSON.stringify(json);
      stringified = stringified.replace(/\\\\n/g, '\\n');
      stringified = stringified.replace(/\\\//g, '/');
      json = JSON.parse(stringified);
      this.setState({ json: json });
    });
    api
      .get('users')
      .then((response) => {
        this.setState({ users: response.data });
        api
          .get('submissions')
          .then((response) => {
            var resp = response.data;
            resp = resp.map((submission) => {
              submission.username =
                this.state.users.find((user) => user._id === submission.userId)
                  ?.username ?? 'No User';
              return submission;
            });

            this.setState({ submissions: resp });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  nextPath(path, submission) {
    this.props.history.push({
      pathname: path,
      state: { questions: this.state.json, responses: submission },
    });
  }
  enterSurvey(submission) {
    this.props.history.push({
      pathname: '/DesignAssistantSurvey',
      state: {
        prevResponses: submission.submission,
        submission_id: submission._id,
        user_id: this.userID,
        filters: {
          roles: submission.roles,
          domain: submission.domain,
          region: submission.region,
          lifecycle: submission.lifecycle,
        },
      },
    });
  }
  deleteUser(id) {
    api.delete('users/' + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      users: this.state.users.filter((ul) => ul._id !== id),
    });
  }
  deleteSubmission(id) {
    api.delete('submissions/delete/' + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      submissions: this.state.submissions.filter((ul) => ul._id !== id),
    });
  }

  deleteUserSubmission(id) {
    api.delete('submissions/deleteAll/' + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      submissions: this.state.submissions.filter((ul) => ul.userId !== id),
    });
  }

  /**
   * Makes a request to the users endpoint to update the role of the user
   * with id= "id"
   */
  changeRole(id, role) {
    api.put('users/' + id, { role: role }).then((response) => {
      this.state.users.find(
        (user) => user._id === response.data._id
      ).role = role;
      this.setState({
        users: this.state.users,
      });
    });
  }

  // returns the current page's rows for the users table
  usersList() {
    return !Array.isArray(this.state.users)
      ? null
      : this.getFilteredUsers()
        .slice(
          this.state.usersPage * this.state.usersRowsPerPage,
          this.state.usersPage * this.state.usersRowsPerPage +
          this.state.usersRowsPerPage
        )
        .map((currentuser) => {
          return (
            <User
              user={currentuser}
              nextPath={this.nextPath}
              changeRole={this.changeRole}
              showModal={this.showDeleteUserModal}
              role={this.role}
              key={currentuser._id}
            />
          );
        });
  }

  // returns the current page's rows for the submission table
  submissionList() {
    return this.getFilteredSubmissions()
      .slice(
        this.state.submissionsPage * this.state.submissionsRowsPerPage,
        this.state.submissionsPage * this.state.submissionsRowsPerPage +
        this.state.submissionsRowsPerPage
      )
      .map((currentsubmission, idx) => {
        let convertedDate = new Date(currentsubmission.date).toLocaleString(
          'en-US',
          {
            timeZone:
              Intl.DateTimeFormat()?.resolvedOptions()?.timeZone ?? 'UTC',
          }
        );
        return (
          <TableRow key={idx}>
            <TableCell style={{ textAlign: 'left' }}>
              {currentsubmission.username}
            </TableCell>
            <TableCell style={{ textAlign: 'left' }}>
              {currentsubmission.projectName}
            </TableCell>
            <TableCell style={{ textAlign: 'left' }}>{convertedDate}</TableCell>
            <TableCell style={{ textAlign: 'left' }}>
              {currentsubmission.completed ? 'Yes' : 'No'}
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <Button
                size="sm"
                onClick={() =>
                  this.nextPath('/Results/', currentsubmission.submission ?? {})
                }
              >
                {' '}
                Responses
              </Button>
            </TableCell>
            <TableCell align="center">
              {' '}
              <FontAwesomeIcon
                onClick={() => {
                  this.enterSurvey(currentsubmission ?? {});
                }}
                icon={faPencilAlt}
                size="md"
                className="mt-2"
                cursor="pointer"
                title="Edit survey submission"
              />
            </TableCell>
            <TableCell>
              <IconButton
                size="small"
                style={{ paddingTop: '0.10em' }}
                color="secondary"
                onClick={() => {
                  this.showDeleteSubmisionModal(currentsubmission);
                }}
              >
                <DeleteIcon style={{ color: red[500] }} />{' '}
              </IconButton>
            </TableCell>
          </TableRow>
        );
      });
  }

  /**
   * Sets the flags to display/hide the appropriate fitler menus
   */
  handleTabChange(key) {
    if (key === 'userManagement') {
      this.setState({ showUsersFilter: true, showSubmissionsFilter: false });
    } else if (key === 'submissions')
      this.setState({ showSubmissionsFilter: true, showUsersFilter: false });
    else {
      this.setState({ showUsersFilter: false, showSubmissionsFilter: false });
    }
  }

  // reset filters to defaults
  resetFilters(event) {
    this.setState({
      orgFilter: '',
      roleFilter: '',
      userFilter: '',
      projectFilter: '',
    });
    event.target.reset();
  }

  /**
   * Sets the filters on the users table upon
   * submission of the user filters form
   */
  handleUserFilters(event) {
    event.preventDefault();
    let form = event.target.elements;
    let orgFilter = form.orgFilter.value;
    let roleFilter = form.roleFilter.value;
    this.setState({
      orgFilter: orgFilter,
      roleFilter: roleFilter,
      usersPage: 0,
      submissionsPage: 0,
    });
  }

  /**
   * Sets the filters on the submissions table upon
   * submission of the submission filters form
   */
  handleSubmissionFilters(event) {
    event.preventDefault();
    let form = event.target.elements;
    let userFilter = form.userFilter.value;
    let projectFilter = form.projectNameFilter.value;
    this.setState({
      userFilter: userFilter,
      projectFilter: projectFilter,
      usersPage: 0,
      submissionsPage: 0,
    });
  }

  // Sets the flag to show the DeleteUserModal
  showDeleteUserModal(user) {
    this.setState({ userToDelete: user, showDeleteUserModal: true });
  }

  // Sets the flag to show the DeleteSubmissionModal
  showDeleteSubmisionModal(submission) {
    this.setState({
      submissionToDelete: submission,
      showDeleteSubmissionModal: true,
    });
  }

  /**
   * Hides any modals present on the screen
   * Resets and selections present
   */
  hideModal() {
    this.setState({
      userToDelete: null,
      submissionToDelete: null,
      showDeleteUserModal: false,
      showDeleteSubmissionModal: false,
    });
  }

  /**
   * Deletes the selected user and hides the DeleteUserModal
   * If selected, deletes all submissions of the selected user as well
   */
  confirmDeleteUser(deleteSubmissions) {
    if (deleteSubmissions) {
      this.deleteUserSubmission(this.state.userToDelete._id);
    }
    this.deleteUser(this.state.userToDelete._id);
    this.hideModal();
  }

  /**
   * Deletes the selected submission,
   * hides the DeleteSubmissionModal
   */
  confirmDeleteSubmission() {
    this.deleteSubmission(this.state.submissionToDelete._id);
    this.hideModal();
  }

  handleUsersChangePage = (event, usersPage) => {
    this.setState({ usersPage });
  };

  handleUsersChangeRowsPerPage = (event) => {
    this.setState({ usersPage: 0, usersRowsPerPage: event.target.value });
  };

  handleSubmissionsChangePage = (event, submissionsPage) => {
    this.setState({ submissionsPage });
  };

  handleSubmissionsChangeRowsPerPage = (event) => {
    this.setState({
      submissionsPage: 0,
      submissionsRowsPerPage: event.target.value,
    });
  };

  // return a list of users that meet the user filter's criteria
  getFilteredUsers() {
    let filtered = [];
    if (this.state.users.length) {
      this.state.users.forEach((user) => {
        if (
          this.state.roleFilter === '' ||
          user.role
            ?.toLowerCase()
            .includes(this.state.roleFilter?.toLowerCase())
        )
          if (
            this.state.orgFilter === '' ||
            user.organization
              ?.toLowerCase()
              .includes(this.state.orgFilter?.toLowerCase())
          )
            filtered.push(user);
      });
    }
    return filtered;
  }

  // return a list of submissions that meet the submission filter's criteria
  getFilteredSubmissions() {
    let filtered = [];
    this.state.submissions.forEach((currentsubmission) => {
      if (
        this.state.userFilter === '' ||
        currentsubmission.username
          ?.toLowerCase()
          .includes(this.state.userFilter?.toLowerCase())
      )
        if (
          this.state.projectFilter === '' ||
          currentsubmission.projectName
            ?.toLowerCase()
            .includes(this.state.projectFilter?.toLowerCase())
        )
          filtered.push(currentsubmission);
    });
    return filtered;
  }

  render() {
    return (
      <div>
        <div className="dimensionNav">
          <DeleteUserModal
            onHide={this.hideModal}
            confirmDelete={this.confirmDeleteUser}
            show={this.state.showDeleteUserModal}
            user={this.state?.userToDelete}
          />
          <DeleteSubmissionModal
            onHide={this.hideModal}
            confirmDelete={this.confirmDeleteSubmission}
            show={this.state.showDeleteSubmissionModal}
            submission={this.state?.submissionToDelete}
          />
          {!this.state.showUsersFilter ? null : (
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Filters
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body className="cardBody">
                    <Form
                      onSubmit={(e) => this.handleUserFilters(e)}
                      onReset={(e) => this.resetFilters(e)}
                    >
                      <Form.Group controlId="roleFilter">
                        <Form.Label>Role</Form.Label>
                        <Form.Control type="text" placeholder="Role Name" />
                      </Form.Group>
                      <Form.Group controlId="orgFilter">
                        <Form.Label>Organization</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Organization Name"
                        />
                      </Form.Group>
                      <Form.Group controlId="formSubmit"></Form.Group>
                      <input
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        value="Submit"
                      />
                      <Button type="reset" id="clearFilter">
                        <div>
                          Reset <i className="fa fa-undo fa-fw"></i>
                        </div>
                      </Button>
                    </Form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          )}
          {!this.state.showSubmissionsFilter ? null : (
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Filters
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body className="cardBody">
                    <Form
                      onSubmit={(e) => this.handleSubmissionFilters(e)}
                      onReset={(e) => this.resetFilters(e)}
                    >
                      <Form.Group controlId="userFilter">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" placeholder="User Name" />
                      </Form.Group>
                      <Form.Group controlId="projectNameFilter">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control type="text" placeholder="Project Name" />
                      </Form.Group>
                      <Form.Group controlId="formSubmit"></Form.Group>
                      <input
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        value="Submit"
                      />
                      <Button type="reset" id="clearFilter">
                        <div>
                          Reset <i className="fa fa-undo fa-fw"></i>
                        </div>
                      </Button>
                    </Form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          )}
        </div>
        <main
          id="wb-cont"
          role="main"
          property="mainContentOfPage"
          className="container"
          style={{ paddingBottom: '1rem' }}
        >
          <h1 className="section-header">Administration Panel</h1>
          <Tabs
            defaultActiveKey="surveyManagement"
            onSelect={this.handleTabChange}
          >
            <Tab eventKey="surveyManagement" title="Survey Management">
              <QuestionTable />
            </Tab>
            <Tab eventKey="userManagement" title="Users">
              <div className="table-responsive mt-3">
                <Table id="users" className="user-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Signup onLanding={false} />
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'left' }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'left' }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'left' }}
                      >
                        Organization
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'center' }}
                      >
                        Role
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'center' }}
                      >
                        Submissions
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'center' }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.usersList()}</TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.getFilteredUsers().length}
                        rowsPerPage={this.state.usersRowsPerPage}
                        page={this.state.usersPage}
                        onChangePage={this.handleUsersChangePage}
                        onChangeRowsPerPage={this.handleUsersChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </Tab>
            <Tab eventKey="submissions" title="Submissions">
              <div className="table-responsive mt-3">
                <Table id="submissions" className="submission-table">
                  <TableHead>
                    <TableRow hover>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'left' }}
                      >
                        User Name
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'left' }}
                      >
                        Project Name
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'left' }}
                      >
                        Date
                      </TableCell>

                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'left' }}
                      >
                        Completed
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'center' }}
                      >
                        Responses
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'center' }}
                      >
                        Edit
                      </TableCell>
                      <TableCell
                        className="score-card-headers"
                        style={{ textAlign: 'center' }}
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.submissionList()}</TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.getFilteredSubmissions().length}
                        rowsPerPage={this.state.submissionsRowsPerPage}
                        page={this.state.submissionsPage}
                        onChangePage={this.handleSubmissionsChangePage}
                        onChangeRowsPerPage={
                          this.handleSubmissionsChangeRowsPerPage
                        }
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </Tab>
            <Tab eventKey="trustedAIProviders" title="Trusted AI Providers">
              <AdminProviders />
            </Tab>
            <Tab eventKey="trustedAIResources" title="Trusted AI Resources">
              <AdminResources />
            </Tab>
            <Tab eventKey="analytics" title="Analytics">
              <AnalyticsDashboard />
            </Tab>
          </Tabs>
          <Login />
        </main>
      </div>
    );
  }
}
