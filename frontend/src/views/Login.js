import React,{ Component, useState } from 'react';
import { Modal, Form, Button, Checkbox } from 'react-bootstrap';
import "../css/login.css";
import Signup from "./Signup";
import axios from 'axios';
import { event } from 'jquery';
import { getLoggedInUser, expireAuthToken } from '../helper/AuthHelper';


export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLoginModal: false,
            user: undefined
        }
    }

    componentDidMount() {
        getLoggedInUser().then( user => {
            this.setState({ user: user });
            console.log(user);
        });
    }

    handleSubmit(event){
        let form = event.target.elements;
        let username = form.loginUsername.value;
        let password = form.loginPassword.value;
        let remember = form.loginRemember.checked;
        console.log("Attempting to Log In with username:" + username + " and password:" + password );
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
                    if(remember){
                        localStorage.setItem('authToken', result["token"]);
                    }
                    else{
                        sessionStorage.setItem('authToken', result["token"]);
                    }
                    this.setState({user: result["user"]});
                    this.setState({showLoginModal: false});
                }
            });
    }

    handleLogOut(){
        console.log("Logged Out");
        expireAuthToken();
        this.setState({user: undefined});
    }

    renderUser(){
        const handleShow = () => this.setState({showLoginModal: true});
        let user = this.state.user;
        console.log(user);
        if(user){
            return (
                <div>
                    <Button variant="primary" onClick={() =>  this.handleLogOut()} className="user-status">
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
                                <Form.Control type="text" placeholder="Username" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="loginPassword">
                                <i className="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="Password" required="required"/>
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
                        <a href="#" onClick={handleClose}>Continue without an account</a>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}