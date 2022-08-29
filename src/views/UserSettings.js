import React, { Component } from 'react';
import { Modal, Form } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

import {
  getLoggedInUser,
  expireAuthToken,
  getAuthToken,
} from '../helper/AuthHelper';
import '../css/usersettings.css';
import api from '../api';
import ReactGa from 'react-ga';
import { withRouter } from 'react-router-dom';

const LogoutHandler = () => {
  console.log('LogoutHandler');
  ReactGa.event({
    category: 'Button',
    action: 'User Logged Out',
  });
};

// TASK-TODO: Removing anything that has to do will a password or redirect it to portal user settings.
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
    return api
      .post(
        'users/updateEmail',
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
    return api
      .post(
        'users/updateUsername',
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
    return api
      .post(
        'users/updatePassword',
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
    return api
      .post(
        'users/updateOrganization',
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontFamily: 'helvetica',
            width: '100%',
            justifyContent: 'right',
          }}
        >
          <Button style={{ fontFamily: 'helvetica' }} variant="text" onClick={() => this.navHome()}>
            Home
          </Button>
          {this.state.user ? (
            this.state.user.role === 'admin' ||
              this.state.user.role === 'superadmin' ? (
              <Button style={{ fontFamily: 'helvetica' }} variant="text" onClick={() => this.navAdmin()}>
                Admin Panel
              </Button>
            ) : null
          ) : null}
          {/* <Button
            style={{ fontFamily: 'helvetica' }}
            variant="text"
            onClick={() =>
              (window.location = 'https://portal.ai-global.org/settings')
            }
          >
            Edit Account in AI Portal
          </Button> */}
          <Button style={{ fontFamily: 'helvetica' }} variant="text" onClick={() => this.handleLogout()}>
            Log Out
          </Button>
        </div>
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
