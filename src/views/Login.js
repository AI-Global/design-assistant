import React, { Component } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Button, Box, Grid } from '@material-ui/core';
import '../css/login.css';
import Signup from './Signup';
import api from '../api';
import { getLoggedInUser, expireAuthToken } from '../helper/AuthHelper';
import UserSettings from './UserSettings';
import ReactGa from 'react-ga';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      showResetPassword: false,
      showSetNewPassword: false,
      username: { isInvalid: false, message: '' },
      password: { isInvalid: false, message: '' },
      email: { isInvalid: false, message: '' },
      newPassword: { isInvalid: false, message: '' },
      passwordConfirmation: { isInvalid: false, message: '' },
      user: undefined,
    };
  }

  componentDidMount() {
    getLoggedInUser().then((user) => {
      this.setState({ user: user });
    });
    const params = (new URL(document.location)).searchParams;
    const token = params.get("token");
    const tokenEmail = params.get("email");
    console.log(token, tokenEmail);
    if (token && tokenEmail) {
      this.setState({ showSetNewPassword: true });
    }
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

  resetValidations() {
    this.setState({
      password: { isInvalid: false, message: '' },
      email: { isInvalid: false, message: '' },
      username: { isInvalid: false, message: '' },
      newPassword: { isInvalid: false, message: '' },
      passwordConfirmation: { isInvalid: false, message: '' },
    });
  }

  handleNewPasswordSubmit(event) {
    event.preventDefault();
    this.resetValidations();
    const params = (new URL(document.location)).searchParams;
    const token = params.get("token");
    const email = params.get("email");
    let form = event.target.elements;
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
    return api
      .post(
        'users/resetPassword',
        {
          newPassword,
          email,
          token,
        },
      )
      .then((response) => {
        const result = response.data;
        if (!result.errors) {
          toast('Password reseted succesfully', {
            toastId: 'passwordReseted',
          });
          this.setState({ showSetNewPassword: false });
          window.history.pushState({}, '', '/');
        }
      })
      .catch((err) => {
        let result = err.response.data;
        this.setState(result);
      });
  }

  async handleResetPasswordSubmit(event) {
    event.preventDefault();
    this.resetValidations();
    let form = event.target.elements;
    let email = form.resetPassword.value;
    try {
      const response = await api
        .post(
          'users/sendResetPasswordLink',
          {
            email,
          });
      const result_1 = response.data;
      if (!result_1.errors) {
        toast('Reset password email sent', {
          toastId: 'passwordResetEmail',
        });
        this.setState({ showResetPassword: false });
      }
    } catch (err) {
      let result_3 = err.response.data;
      this.setState(result_3);
    }
  }

  /**
   * Renders user information if there
   * is a user logged in.
   */
  renderUser() {
    const handleShow = () => this.setState({ showLoginModal: true });
    let user = this.state.user;
    console.log('Logged in user: ', user);
    if (user && user.username) {
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
            border: '1px solid #0066FF',
            backgroundColor: '#FFFFFF',
            fontFamily: 'Roboto',
            borderRadius: '20px',
            color: '#0066FF',
            justifyContent: 'center',
            display: 'flex',
            margin: '10px',
            textTransform: 'uppercase',
            textAlign: 'center',
            alignItems: 'center',
            lineHeight: '28px',
            fontSize: '15px',
            fontWeight: '400',
            fontStyle: 'normal',
            boxSizing: 'border-box',
            // width: '110px',
            // height: '52px'
          }}
          variant="outlined"
        >
          Log in
        </Button>
      );
    }
  }

  render() {
    const showLogin = this.state.showLoginModal;
    const showResetPassword = this.state.showResetPassword;
    const showSetNewPassword = this.state.showSetNewPassword;
    const handleClose = () => this.setState({ showLoginModal: false });
    const handlePasswordClose = () => this.setState({ showResetPassword: false });
    const handleSetNewPasswordClose = () => this.setState({ showSetNewPassword: false });


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
              {/* <p className="disabled">Not a member yet?&nbsp;</p> */}
              <Signup onLanding={true} signedOut={false} admin={true} />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                  this.setState({ showResetPassword: true });
                }}
              >
                Forgot Password?
              </a>
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

        <Modal
          show={showResetPassword}
          onHide={handlePasswordClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-login modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.handleResetPasswordSubmit(e)}>
              <Form.Group controlId="resetPassword">
                <i className="fa fa-envelope"></i>
                <Form.Control
                  type="email"
                  placeholder="Account's Email"
                  required="required"
                  autoComplete="email"
                  isInvalid={this.state.email?.isInvalid}
                  aria-label="reset password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.email?.message}
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
          show={showSetNewPassword}
          onHide={handleSetNewPasswordClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-login modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Set New Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.handleNewPasswordSubmit(e)}>
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
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          closeButton={false}
        />
      </Box>
    );
  }
}
