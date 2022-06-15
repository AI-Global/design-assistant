import React, { Component } from 'react';
import { Modal, Form } from 'react-bootstrap';
import '../css/signup.css';
import api from '../api';
import { expireAuthToken } from '../helper/AuthHelper';
import ReactGa from 'react-ga';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const owasp = require('owasp-password-strength-test');

const LandingButton = withStyles(() => ({
  root: {
    borderRadius: '8px',
    border: '1px solid',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    borderColor: '#386EDA',
    borderRadius: '20px',
    color: '#386EDA',
    '&:hover': {
      backgroundColor: '#386EDA',
      borderColor: '#386EDA',
      color: '#FFFFFF',
    },
  },
}))(Button);

owasp.config({
  minLength: 8,
  minOptionalTestsToPass: 4,
});

const CreateAccHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'User clicked on Create new account',
  });
};

const AccCreatedHandler = () => {
  ReactGa.event({
    category: 'Button',
    action: 'User Successfully Created account',
  });
};

const RegistrationDescription = `You can create an account for the Responsible AI Design Assistant! 
After creating your account, an email verfication will be sent to you.`;

const roleOptions = [
  {
    label: 'Security Admin',
    value: 'securityAdmin',
  },
  {
    label: 'Product Owner',
    value: 'productOwner',
  },
  {
    label: 'Data Scientist',
    value: 'dataScientist',
  },
  {
    label: 'Business Executive',
    value: 'businessExecutive',
  },
  {
    label: 'Legal and Compliance',
    value: 'legalCompliance',
  },
  {
    label: 'Auditor',
    value: 'auditor',
  },
];

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignupModal: false,
      email: { isInvalid: false, message: '' },
      username: { isInvalid: false, message: '' },
      password: { isInvalid: false, message: '' },
      passwordConfirmation: { isInvalid: false, message: '' },
      collabRole: { isInvalid: false, message: '' },
      emailInput: '',
      usernameInput: '',
      emailAsUsername: true,
    };
  }

  /**
   * Upon submission of the signup form, function
   * sends form values to the backend to be validated
   * and added to the DB.
   */
  handleSignupSubmit(event) {
    event.preventDefault();
    this.setState({
      email: { isInvalid: false, message: '' },
      username: { isInvalid: false, message: '' },
      password: { isInvalid: false, message: '' },
      passwordConfirmation: { isInvalid: false, message: '' },
      role: { isInvalid: false, message: '' },
      organization: { isInvalid: false, message: '' },
      collabRole: { isInvalid: false, message: '' },
    });
    event.preventDefault();
    let form = event.target.elements;
    let email = form.signupEmail.value;
    let username = form.signupUsername.value;
    let password = form.signupPassword.value;
    let passwordConfirmation = form.signupPasswordConfirmation.value;
    let organization = form.signupOrganization.value;
    let collabRole = form.signupcollabRole.value;

    let result = owasp.test(password);
    if (password !== passwordConfirmation) {
      this.setState({
        passwordConfirmation: {
          isInvalid: true,
          message: "Those passwords didn't match. Please try again.",
        },
      });
    }
    else if (!result.strong) {
      this.setState({
        password: { isInvalid: true, message: result.errors.join('\n') },
      });
    }
    else {
      api
        .post('users/create', {
          email: email,
          username: username,
          password: password,
          passwordConfirmation: passwordConfirmation,
          organization: organization,
          collabRole: collabRole,
        })
        .then((response) => {
          const result = response.data;
          if (result.errors) {
            console.log(result.errors);
          } else {
            AccCreatedHandler();
            expireAuthToken();
            sessionStorage.setItem('authToken', result['token']);
            toast('Account created', {
              toastId: 'created',
            });
            setTimeout(window.location.reload(), 2500);
          }
        })
        .catch((err) => {
          let result = err.response.data;
          this.setState(result);
        });
    }
  }

  /**
   * Updates the username input to match
   * if user has toggled to sign in with email.
   */
  handleEmailInput(event) {
    let email = event.target.value;
    this.setState({ emailInput: email });
    if (this.state.emailAsUsername) {
      this.setState({ usernameInput: email });
    }
  }

  toggleUsernameAsEmail(event) {
    let toggle = event.target.checked;
    this.setState({ emailAsUsername: toggle });
    if (toggle) {
      this.setState({ usernameInput: this.state.emailInput });
    } else {
      this.setState({ usernameInput: '' });
    }
  }

  render() {
    const showSignup = this.state.showSignupModal;
    const handleSignupClose = () => this.setState({ showSignupModal: false });
    const handleSignupShow = () => this.setState({ showSignupModal: true });
    return (
      <div
        style={{ display: 'inline-block', color: 'blue', cursor: 'pointer' }}
      >
        {this.props.signedOut && (
          <LandingButton
            onClick={() => {
              handleSignupShow();
              CreateAccHandler();
            }}
          >
            Sign Up
          </LandingButton>
        )}
        {this.props.onLanding && (
          <a
            onClick={() => {
              handleSignupShow();
              CreateAccHandler();
            }}
          >
            Create your account
          </a>
        )}
        {!this.props.admin && (
          <IconButton
            aria-label="add new user"
            size="small"
            onClick={() => {
              handleSignupShow();
              CreateAccHandler();
            }}
          >
            <Add />
          </IconButton>
        )}

        <Modal
          show={showSignup}
          onHide={handleSignupClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-signup modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>User Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.handleSignupSubmit(e)}>
              <p className="description">{RegistrationDescription}</p>
              <Form.Group controlId="signupEmail">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  required="required"
                  isInvalid={this.state.email.isInvalid}
                  onChange={(e) => this.handleEmailInput(e)}
                  autoComplete="email"
                  aria-label="email"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.email.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="signupUsernameAsEmail">
                <Form.Check
                  type="checkbox"
                  label="Sign in using email instead of username"
                  defaultChecked={this.state.emailAsUsername}
                  onChange={(e) => this.toggleUsernameAsEmail(e)}
                />
              </Form.Group>
              <Form.Group controlId="signupUsername">
                {this.state.emailAsUsername && (
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    required="required"
                    isInvalid={this.state.username.isInvalid}
                    autoComplete="username"
                    aria-label="username"
                    value={this.state.usernameInput}
                    readOnly
                  />
                )}
                {!this.state.emailAsUsername && (
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    required="required"
                    isInvalid={this.state.username.isInvalid}
                    autoComplete="username"
                    aria-label="username"
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {this.state.username.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="signupPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required="required"
                  isInvalid={this.state.password.isInvalid}
                  autoComplete="current-password"
                  aria-label="password"
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="password-errors"
                >
                  {this.state.password.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="signupPasswordConfirmation">
                <Form.Control
                  type="password"
                  placeholder="Confirm Your Password"
                  required="required"
                  isInvalid={this.state.passwordConfirmation.isInvalid}
                  autoComplete="new-password"
                  aria-label="confirm password"
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.passwordConfirmation.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="signupcollabRole">
                <Form.Control as="select">
                  <option value="" disabled selected hidden>
                    Role
                  </option>

                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="signupOrganization">
                <Form.Control
                  type="text"
                  placeholder="Organization (Optional)"
                  aria-label="organization"
                />
              </Form.Group>
              <input
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                value="Create My Account"
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
      </div>
    );
  }
}
