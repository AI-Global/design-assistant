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
            name: {isInvalid: false, message: ""},
            email: {isInvalid: false, message: ""},
            username: {isInvalid: false, message: ""},
            password: {isInvalid: false, message: ""},
            passwordConfirmation: {isInvalid: false, message: ""}
        }
    }

    handleSignupSubmit(event){
        this.setState({name: {isInvalid: false, message: ""}, 
            email: {isInvalid: false, message: ""},
            username: {isInvalid: false, message: ""},
            password: {isInvalid: false, message: ""},
            passwordConfirmation: {isInvalid: false, message: ""}});
        event.preventDefault();
        let form = event.target.elements;
        let name = form.signupName.value;
        let email = form.signupEmail.value;
        let username = form.signupUsername.value;
        let password = form.signupPassword.value;
        let passwordConfirmation = form.signupPasswordConfirmation.value;
        if(password!==passwordConfirmation){
            this.setState({passwordConfirmation: {isInvalid: true, message: "Those passwords didn't match. Try again."}})
        }
        else{
            axios.post('http://localhost:9000/users/create/', {
                name: name,
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
                    console.log(result["token"]);
                    sessionStorage.setItem('authToken', result["token"])
                    window.location.reload();
                }
            }).catch( err => {
                let result = err.response.data;
                this.setState(result);
            });
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
                            <Form.Group controlId="signupName">
                                <Form.Control type="text" placeholder="Name" required="required" isInvalid={this.state.name.isInvalid} autoComplete="name"/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.name.message}
                                </Form.Control.Feedback>                            
                            </Form.Group>
                            <Form.Group controlId="signupEmail">
                                <Form.Control type="email" placeholder="Email" required="required" isInvalid={this.state.email.isInvalid} autoComplete="email"/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.email.message}
                                </Form.Control.Feedback>
                            </Form.Group>                  
                            <Form.Group controlId="signupUsername">
                                <Form.Control type="text" placeholder = "Username" required="required" isInvalid={this.state.username.isInvalid} autoComplete="username"/>
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