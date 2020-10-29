import React,{ Component } from 'react';
import { Modal, Form} from 'react-bootstrap';
import "../css/signup.css";
import axios from 'axios';
import { expireAuthToken } from '../helper/AuthHelper';

const RegistrationDescription = `You can create an account for the Responsible AI Design Assistant! 
After creating your account, an email verfication will be sent to you.`

export default class Signup extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            showSignupModal: false,
            email: {isInvalid: false, message: ""},
            username: {isInvalid: false, message: ""},
            password: {isInvalid: false, message: ""},
            passwordConfirmation: {isInvalid: false, message: ""},
            emailInput: "",
            usernameInput: "",
            emailAsUsername: true
        }
    }

    /**
     * Upon submission of the signup form, function
     * sends form values to the backend to be validated
     * and added to the DB.
     */
    handleSignupSubmit(event){
        this.setState({email: {isInvalid: false, message: ""},
            username: {isInvalid: false, message: ""},
            password: {isInvalid: false, message: ""},
            passwordConfirmation: {isInvalid: false, message: ""}});
        event.preventDefault();
        let form = event.target.elements;
        let email = form.signupEmail.value;
        let username = form.signupUsername.value;
        let password = form.signupPassword.value;
        let passwordConfirmation = form.signupPasswordConfirmation.value;
        if(password!==passwordConfirmation){
            this.setState({passwordConfirmation: {isInvalid: true, message: "Those passwords didn't match. Try again."}})
        }
        else{
            axios.post('http://localhost:9000/users/create/', {
                email: email,
                username: username,
                password: password,
                passwordConfirmation: passwordConfirmation
            }).then(response => {
                const result = response.data;
                if(result.errors){
                    console.log(result.errors);
                }
                else{
                    expireAuthToken();
                    sessionStorage.setItem('authToken', result["token"])
                    window.location.reload();
                }
            }).catch( err => {
                let result = err.response.data;
                this.setState(result);
            });
        }
    }

    /**
     * Updates the username input to match 
     * if user has toggled to sign in with email.
     */
    handleEmailInput(event){
        let email = event.target.value;
        this.setState({emailInput: email})
        if(this.state.emailAsUsername){
            this.setState({usernameInput: email});
        }
    }   

    toggleUsernameAsEmail(event){
        let toggle = event.target.checked;
        this.setState({emailAsUsername: toggle})
        if(toggle){
            this.setState({usernameInput: this.state.emailInput})
        }
        else{
            this.setState({usernameInput: ""});
        }
    }

    render(){
        const showSignup = this.state.showSignupModal;
        const handleSignupClose = () => this.setState({showSignupModal: false});
        const handleSignupShow = () => this.setState({showSignupModal: true});
        return(
            <div style={{display: "inline-block"}}>
                <a href="#/" onClick={handleSignupShow}>Create your account</a>
                <Modal show={showSignup}
                onHide={handleSignupClose}
                backdrop="static"
                keyboard={false}
                dialogClassName="modal-signup modal-dialog-centered">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            User Registration
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => this.handleSignupSubmit(e)}>
                            <p className="description">
                                {RegistrationDescription}
                            </p>
                            <Form.Group controlId="signupEmail">
                                <Form.Control type="email" placeholder="Email" required="required" isInvalid={this.state.email.isInvalid} onChange={(e) => this.handleEmailInput(e)} autoComplete="email"/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.email.message}
                                </Form.Control.Feedback>
                            </Form.Group>                  
                            <Form.Group controlId="signupUsernameAsEmail">
                                <Form.Check type="checkbox" label="Sign in using email instead of username" defaultChecked={this.state.emailAsUsername} onChange={(e) => this.toggleUsernameAsEmail(e)} />
                            </Form.Group>             
                            <Form.Group controlId="signupUsername">
                                <Form.Control type="text" placeholder = "Username" required="required" isInvalid={this.state.username.isInvalid} autoComplete="username" readOnly={this.state.emailAsUsername} value={this.state.usernameInput}/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.username.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="signupPassword">
                                <Form.Control type="password" placeholder="Password" required="required" isInvalid={this.state.password.isInvalid} autoComplete="current-password"/>
                                <Form.Control.Feedback type="invalid" className="password-errors">
                                    {this.state.password.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="signupPasswordConfirmation">
                                <Form.Control type="password" placeholder="Confirm Your Password" required="required" isInvalid={this.state.passwordConfirmation.isInvalid} autoComplete="new-password"/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.passwordConfirmation.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Create My Account" />


                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}