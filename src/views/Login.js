import React, { Component } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import { Box } from '@material-ui/core';

import '../css/login.css';
import Signup from './Signup';
import api from '../api';
import { getLoggedInUser, expireAuthToken } from '../helper/AuthHelper';
import UserSettings from './UserSettings';
import ReactGa from 'react-ga';

const LoginHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'Login clicked',
  });
};

const ContinueHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'User chose to continue without an account',
  });
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginModal: false,
      username: { isInvalid: false, message: '' },
      password: { isInvalid: false, message: '' },
      user: undefined,
    };
  }

  componentDidMount() {
    getLoggedInUser().then((user) => {
      this.setState({ user: user });
    });
  }

  /**
   * Upon submission of login form, function sends form
   * values to the backend to be validated against the database
   * and sends back authorization token and user information
   */
  handleSubmit(event) {
    this.setState({
      username: { isInvalid: false, message: '' },
      password: { isInvalid: false, message: '' },
    });
    event.preventDefault();
    let form = event.target.elements;
    let username = form.loginUsername.value;
    let password = form.loginPassword.value;
    let remember = form.loginRemember.checked;
    api
      .post('users/auth', {
        username: username?.toLowerCase(),
        password: password,
      })
      .then((response) => {
        const result = response.data;
        if (result.errors) {
          console.log(result.errors);
        } else {
          expireAuthToken();
          if (remember) {
            localStorage.setItem('authToken', result['token']);
          } else {
            sessionStorage.setItem('authToken', result['token']);
          }
          this.setState({ user: result['user'] });
          this.setState({ showLoginModal: false });
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error(err);
        let result = err?.response?.data;
        this.setState(result);
      });
  }

  /**
   * Renders user information if there
   * is a user logged in.
   */
  renderUser() {
    const handleShow = () => this.setState({ showLoginModal: true });
    let user = this.state.user;
    if (user) {
      return (
        <Box className="user-status">
          <UserSettings />
          <Box>
            Logged in as:{' '}
            <strong className="anthem-blue">{user.username}</strong> &nbsp;
          </Box>
        </Box>
      );
    } else {
      return (
        <Button
          onClick={() => {
            handleShow();
            LoginHandler();
          }}
          style={{
            fontFamily: 'Roboto',
          }}
        >
          Log in
        </Button>
      );
    }
  }

  render() {
    const showLogin = this.state.showLoginModal;
    const handleClose = () => this.setState({ showLoginModal: false });

    return (
      <Box>
        {this.renderUser()}
        <Modal
          show={showLogin}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-login modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.handleSubmit(e)}>
              <Form.Group controlId="loginUsername">
                <i className="fa fa-user"></i>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  required="required"
                  isInvalid={this.state.username.isInvalid}
                  autoComplete="username"
                  aria-label="username"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.username.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="loginPassword">
                <i className="fa fa-lock"></i>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required="required"
                  isInvalid={this.state.password.isInvalid}
                  autoComplete="current-password"
                  aria-label="password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.password.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="loginRemember">
                <Form.Check type="checkbox" label="Remember Me" />
              </Form.Group>
              <Form.Group controlId="formSubmit"></Form.Group>
              <input
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                value="Login"
              />
            </Form>
            <Box className="create-account">
              <p className="disabled">Not a member yet?&nbsp;</p>
              <Signup onLanding={true} signedOut={false} admin={true} />
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <a
              href="#/"
              onClick={() => {
                handleClose();
                ContinueHandler();
              }}
            >
              Continue without an account
            </a>
          </Modal.Footer>
        </Modal>
      </Box>
    );
  }
}
