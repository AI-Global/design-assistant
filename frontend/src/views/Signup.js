import React,{ Component } from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import "../css/signup.css";
import axios from 'axios';

const RegistrationDescription = `You can create an account for the Responsible AI Design Assistant! 
After creating your account, an email verfication will be sent to you.`

export default class Signup extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            showSignupModal: false
        }
    }

    handleSubmit(event){
        let form = event.target.elements;
        let name = form.signupName.value;
        let email = form.signupEmail.value;
        let username = form.signupUsername.value;
        let password = form.signupPassword.value;
        let passwordConfirmation = form.signupPasswordConfirmation.value;
        if(password!==passwordConfirmation){
            console.log(password);
            console.log(passwordConfirmation);
            console.log("Passwords not matching");
        }
        axios.post('http://localhost:9000/users/createUser/', {
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
                
            }
        });
    }

    passwordMatching(event){
        event.target.setCustomValidity("Passwords not matching");
    }
    
    render(){
        const showSignup = this.state.showSignupModal;
        const handleClose = () => this.setState({showSignupModal: false});
        const handleShow = () => this.setState({showSignupModal: true});
        return(
            <div style={{display: "inline-block"}}>
                <a href="#" onClick={handleShow}>Create your account</a>
                <Modal show={showSignup}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName="modal-signup modal-dialog-centered">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            User Registration
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <p className="description">
                                {RegistrationDescription}
                            </p>
                            <Form.Group controlId="signupName">
                                <Form.Control type="text" placeholder="Name" required="required" />
                            </Form.Group>
                            <Form.Group controlId="signupEmail">
                                <Form.Control type="email" placeholder="Email" required="required"/>
                            </Form.Group>                  
                            <Form.Group controlId="signupUsername">
                                <Form.Control type="text" placeholder = "Username" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="signupPassword">
                                <Form.Control type="password" placeholder="Password" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="signupPasswordConfirmation">
                                <Form.Control type="password" placeholder="Confirm Your Password" required="required" onInvalid={this.passwordMatching}/>
                            </Form.Group>
                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Create My Account" />


                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}