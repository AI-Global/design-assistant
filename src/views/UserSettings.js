import React, { Component } from 'react';
import { Modal, DropdownButton, Form, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
import {
  getLoggedInUser,
  expireAuthToken,
  getAuthToken,
} from '../helper/AuthHelper';
import '../css/usersettings.css';
import axios from 'axios';
import ReactGa from 'react-ga';
import { withRouter } from 'react-router-dom';

const LogoutHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'User Logged Out',
  });
};

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmailSettings: false,
      showUserNameSettings: false,
      showPasswordSettings: false,
      showOrganizationSettings: false,
      user: undefined,
      password: { isInvalid: false, message: '' },
      email: { isInvalid: false, message: '' },
      username: { isInvalid: false, message: '' },
      newPassword: { isInvalid: false, message: '' },
      passwordConfirmation: { isInvalid: false, message: '' },
    };
  }

  componentDidMount() {
    getLoggedInUser().then((user) => {
      this.setState({ user: user });
    });
  }

  // show modal for changing Email
  changeEmailModal() {
    this.resetValidations();
    this.setState({ showEmailSettings: true });
  }

  // show modal for changing Username
  changeUsernameModal() {
    this.resetValidations();
    this.setState({ showUserNameSettings: true });
  }

  // show modal for changing Password
  changePasswordModal() {
    this.resetValidations();
    this.setState({ showPasswordSettings: true });
  }

  changeOrganizationModal() {
    this.resetValidations();
    this.setState({ showOrganizationSettings: true });
  }

  /**
   * Expires the authorization tokens upon
   * log out button being clicked
   */
  handleLogout() {
    expireAuthToken();
    LogoutHandler();
    // redirect to home page when user logs out
    window.location.pathname = '/';
  }

  /**
   * send post request to update username of user
   * upon submission of change email form
   */
  handleEmailSubmit(event) {
    event.preventDefault();
    this.resetValidations();
    let form = event.target.elements;
    let newEmail = form.newEmail.value;
    let password = form.emailPassword.value;
    let authToken = getAuthToken();
    let endPoint = '/users/updateEmail';
    return axios
      .post(
        process.env.REACT_APP_SERVER_ADDR + endPoint,
        {
          newEmail: newEmail,
          password: password,
        },
        {
          headers: {
            'x-auth-token': authToken,
          },
        }
      )
      .then((response) => {
        const result = response.data;
        if (!result.errors) {
          window.location.reload();
        }
      })
      .catch((err) => {
        let result = err.response.data;
        this.setState(result);
      });
  }

  /**
   * send post request to update username of user
   * upon submission of change username form
   */
  handleUsernameSubmit(event) {
    event.preventDefault();
    this.resetValidations();
    let form = event.target.elements;
    let newUsername = form.newUsername.value;
    let password = form.usernamePassword.value;
    let authToken = getAuthToken();
    let endPoint = '/users/updateUsername';
    return axios
      .post(
        process.env.REACT_APP_SERVER_ADDR + endPoint,
        {
          newUsername: newUsername,
          password: password,
        },
        {
          headers: {
            'x-auth-token': authToken,
          },
        }
      )
      .then((response) => {
        const result = response.data;
        if (!result.errors) {
          window.location.reload();
        }
      })
      .catch((err) => {
        let result = err.response.data;
        this.setState(result);
      });
  }

  /**
   * send post request to update password of user
   * upon submission of change password form and
   * validating confirmation of password field
   */
  handlePasswordSubmit(event) {
    event.preventDefault();
    this.resetValidations();
    let form = event.target.elements;
    let oldPassword = form.oldPassword.value;
    let newPassword = form.newPassword.value;
    let confirmPassword = form.confirmPassword.value;
    if (confirmPassword !== newPassword) {
      this.setState({
        passwordConfirmation: {
          isInvalid: true,
          message: "Those passwords didn't match. Please try again.",
        },
      });
      return;
    }
    let authToken = getAuthToken();
    let endPoint = '/users/updatePassword';
    return axios
      .post(
        process.env.REACT_APP_SERVER_ADDR + endPoint,
        {
          password: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            'x-auth-token': authToken,
          },
        }
      )
      .then((response) => {
        const result = response.data;
        if (!result.errors) {
          window.location.reload();
        }
      })
      .catch((err) => {
        let result = err.response.data;
        this.setState(result);
      });
  }

  /**
   * send post request to update organization of user
   * upon submission of change organization form and
   * validating confirmation of password field
   */
  handleOrganizationSubmit(event) {
    event.preventDefault();
    this.resetValidations();
    let form = event.target.elements;
    let newOrganization = form.newOrganization.value;
    let password = form.organizationPassword.value;
    let authToken = getAuthToken();
    let endPoint = '/users/updateOrganization';
    return axios
      .post(
        process.env.REACT_APP_SERVER_ADDR + endPoint,
        {
          newOrganization: newOrganization,
          password: password,
        },
        {
          headers: {
            'x-auth-token': authToken,
          },
        }
      )
      .then((response) => {
        const result = response.data;
        if (!result.errors) {
          window.location.reload();
        }
      })
      .catch((err) => {
        let result = err.response.data;
        this.setState(result);
      });
  }

  // reset validations in state
  resetValidations() {
    this.setState({
      password: { isInvalid: false, message: '' },
      email: { isInvalid: false, message: '' },
      username: { isInvalid: false, message: '' },
      newPassword: { isInvalid: false, message: '' },
      passwordConfirmation: { isInvalid: false, message: '' },
    });
  }

  // navigation to admin page
  navAdmin() {
    this.props.history.push({
      pathname: '/Admin/',
      state: { userRole: this.state.user.role },
    });
  }

  // navigation to home page
  navHome() {
    this.props.history.push({
      pathname: '/',
      state: { userRole: this.state.user.role },
    });
  }

  render() {
    const handleClose = () =>
      this.setState({
        showEmailSettings: false,
        showUserNameSettings: false,
        showPasswordSettings: false,
        showOrganizationSettings: false,
      });
    return (
      <span>
        <DropdownButton
          className="usersettings-dropdown"
          title={
            <span>
              <FontAwesomeIcon
                icon={faUserCog}
                size="lg"
                className="mr-2"
                cursor="pointer"
                aria-label="Settings Dropdown"
              />
            </span>
          }
        >
          <Dropdown.Item onClick={() => this.navHome()}>
            <i className="fa fa-home fa-fw"></i> Home
          </Dropdown.Item>
          {this.state.user ? (
            this.state.user.role === 'admin' ||
            this.state.user.role === 'superadmin' ? (
              <Dropdown.Item onClick={() => this.navAdmin()}>
                <i className="fa fa-database fa-fw"></i> Admin Panel
              </Dropdown.Item>
            ) : null
          ) : null}
          <Dropdown.Item onClick={() => this.changeEmailModal()}>
            <i className="fa fa-envelope fa-fw"></i> Change Email
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.changeUsernameModal()}>
            <i className="fa fa-user fa-fw"></i> Change Username
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.changePasswordModal()}>
            <i className="fa fa-key fa-fw"></i> Change Password
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.changeOrganizationModal()}>
            {' '}
            <i className="fa fa-users fa-fw"></i> Change Organization
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.handleLogout()}>
            <i className="fa fa-sign-out fa-fw"></i> Log Out
          </Dropdown.Item>
        </DropdownButton>

        <Modal
          show={this.state.showEmailSettings}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-login modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.handleEmailSubmit(e)}>
              <Form.Group controlId="newEmail">
                <i className="fa fa-envelope"></i>
                <Form.Control
                  type="email"
                  placeholder="New Email"
                  required="required"
                  autoComplete="email"
                  isInvalid={this.state.email?.isInvalid}
                  aria-label="new email"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="emailPassword">
                <i className="fa fa-lock"></i>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required="required"
                  autoComplete="current-password"
                  isInvalid={this.state.password?.isInvalid}
                  aria-label="current password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formSubmit"></Form.Group>
              <input
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                value="Submit"
              />
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showUserNameSettings}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-login modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Username</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.handleUsernameSubmit(e)}>
              <Form.Group controlId="newUsername">
                <i className="fa fa-user"></i>
                <Form.Control
                  type="text"
                  placeholder="New Username"
                  required="required"
                  autoComplete="username"
                  isInvalid={this.state.username?.isInvalid}
                  aria-label="new username"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.username?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="usernamePassword">
                <i className="fa fa-lock"></i>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required="required"
                  autoComplete="current-password"
                  isInvalid={this.state.password?.isInvalid}
                  aria-label="current password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formSubmit"></Form.Group>
              <input
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                value="Submit"
              />
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showPasswordSettings}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-login modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.handlePasswordSubmit(e)}>
              <Form.Group controlId="oldPassword">
                <i className="fa fa-lock"></i>
                <Form.Control
                  type="password"
                  placeholder="Current Password"
                  required="required"
                  autoComplete="current-password"
                  isInvalid={this.state.password?.isInvalid}
                  aria-label="current password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="newPassword">
                <i className="fa fa-lock"></i>
                <Form.Control
                  type="password"
                  placeholder="New Password"
                  required="required"
                  autoComplete="password"
                  isInvalid={this.state.newPassword?.isInvalid}
                  aria-label="new password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.newPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <i className="fa fa-lock"></i>
                <Form.Control
                  type="password"
                  placeholder="Confirm New Password"
                  required="required"
                  autoComplete="password"
                  isInvalid={this.state.passwordConfirmation?.isInvalid}
                  aria-label="confirm password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.passwordConfirmation?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formSubmit"></Form.Group>
              <input
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                value="Submit"
              />
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showOrganizationSettings}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-login modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Organization</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.handleOrganizationSubmit(e)}>
              {!this.state?.user?.organization ? null : (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <u>
                      <b>Current Organization</b>
                    </u>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      wordWrap: 'break-word',
                    }}
                  >
                    {this.state?.user?.organization}
                  </div>
                </div>
              )}
              <Form.Group controlId="newOrganization">
                <i className="fa fa-users"></i>
                <Form.Control
                  type="text"
                  placeholder={'New Organization'}
                  autoComplete="organization"
                  aria-label="new organization"
                />
              </Form.Group>
              <Form.Group controlId="organizationPassword">
                <i className="fa fa-lock"></i>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required="required"
                  autoComplete="current-password"
                  isInvalid={this.state.password?.isInvalid}
                  aria-label="current password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formSubmit"></Form.Group>
              <input
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                value="Submit"
              />
            </Form>
          </Modal.Body>
        </Modal>
      </span>
    );
  }
}

export default withRouter(UserSettings);
