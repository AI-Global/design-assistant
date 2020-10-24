import React,{ Component, useState } from 'react';
import { Modal, Form, Button, Checkbox } from 'react-bootstrap';
import "../css/login.css";
import Signup from "./Signup";


export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLoginModal: false
        }
    }

    render(){
        const showLogin = this.state.showLoginModal;
        const handleClose = () => this.setState({showLoginModal: false});
        const handleShow = () => this.setState({showLoginModal: true});
      
        return (
            <>
            <Button variant="primary" onClick={handleShow}>
                Launch static backdrop modal
            </Button>

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
                        <Form>
                            <Form.Group controlId="formUsername">
                                <i className="fa fa-user"></i>
                                <Form.Control type="text" placeholder="Username" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <i className="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="Password" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="formRemember">
                                <Form.Check type="checkbox" label="Remember Me" />
                            </Form.Group>             
                            <Form.Group controlId="formSubmit">
                            </Form.Group>
                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Login" />

                            <div className="create-account">
                                <p className="disabled">Not a member yet?</p>
                                <Signup/>   
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <a href="#">Continue without an account</a>
                    </Modal.Footer>
            </Modal>
            </>
        )
    }
}