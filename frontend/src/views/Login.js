import React,{ Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import "../css/login.css";
import Signup from "./Signup";
import axios from 'axios';
import { getLoggedInUser, expireAuthToken } from '../helper/AuthHelper';


export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLoginModal: false,
            username: {isInvalid: false, message: ""},
            password: {isInvalid: false, message: ""},
            user: undefined
            
        }
    }

    componentDidMount() {
        getLoggedInUser().then( user => {
            this.setState({ user: user });
        });
    }

    /**
     * Upon submission of login form, function sends form 
     * values to the backend to be validated against the database 
     * and sends back authorization token and user information
     */
    handleSubmit(event){
        this.setState({username: {isInvalid: false, message: ""},
            password: {isInvalid: false, message: ""}});
        event.preventDefault();
        let form = event.target.elements;
        let username = form.loginUsername.value;
        let password = form.loginPassword.value;
        let remember = form.loginRemember.checked;
        axios.post('http://localhost:9000/users/auth', {
            username: username,
            password: password
        })
            .then(response => {
                const result = response.data;
                if(result.errors){
                    console.log(result.errors);
                }
                else{
                    expireAuthToken();
                    if(remember){
                        localStorage.setItem('authToken', result["token"]);
                    }
                    else{
                        sessionStorage.setItem('authToken', result["token"]);
                    }
                    this.setState({user: result["user"]});
                    this.setState({showLoginModal: false});
                }
            }).catch(err => {
                let result = err.response.data;
                this.setState(result);
            });
    }

    /**
     * Expires the authorization tokens upon
     * log out button being clicked
     */
    handleLogOut(){
        expireAuthToken();
        this.setState({user: undefined});
    }

    /**
     * Renders user information if there 
     * is a user logged in.
     */
    renderUser(){
        const handleShow = () => this.setState({showLoginModal: true});
        let user = this.state.user;
        if(user){
            return (
                <div className="user-status">
                    Logged in as: {user.username} &nbsp;
                    <Button variant="primary" onClick={() =>  this.handleLogOut()}>
                        Log out
                    </Button>
                </div>
            )
        }
        else{
            return (
                <Button variant="primary" onClick={handleShow} className="user-status">
                    Log in
                </Button>
            )
        }
    }

    render(){
        const showLogin = this.state.showLoginModal;
        const handleClose = () => this.setState({showLoginModal: false});

        return (
            <div>
                {this.renderUser()}
                <Modal show={showLogin}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    dialogClassName="modal-login modal-dialog-centered">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Log In
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => this.handleSubmit(e)}>
                            <Form.Group controlId="loginUsername">
                                <i className="fa fa-user"></i>
                                <Form.Control type="text" placeholder="Username" required="required" isInvalid={this.state.username.isInvalid} autoComplete="username"/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.username.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="loginPassword">
                                <i className="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="Password" required="required" isInvalid={this.state.password.isInvalid} autoComplete="current-password"/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.password.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="loginRemember">
                                <Form.Check type="checkbox" label="Remember Me" />
                            </Form.Group>             
                            <Form.Group controlId="formSubmit">
                            </Form.Group>
                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Login" />
                        </Form>
                        <div className="create-account">
                            <p className="disabled">Not a member yet?&nbsp;</p>
                            <Signup/>   
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <a href="#/" onClick={handleClose}>Continue without an account</a>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}