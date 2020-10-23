import React,{ Component, useState } from 'react';
import { Modal, Form, Button, Checkbox } from 'react-bootstrap';
import "../css/login.css";


export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false
        }
    }

    render(){
        const show = this.state.showModal;
        const handleClose = () => this.setState({showModal: false});
        const handleShow = () => this.setState({showModal: true});
      
        return (
            <>
            <Button variant="primary" onClick={handleShow}>
                Launch static backdrop modal
            </Button>

            <Modal show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName="modal-login">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Log In
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formUsername">
                                <i class="fa fa-user"></i>
                                <Form.Control type="text" placeholder="Username" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <i class="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="Password" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="formRemember">
                                <Form.Check type="checkbox" label="Remember Me" />
                            </Form.Group>
                            <a href="#">Forgot your password?</a>

                            <Form.Group controlId="formSubmit">
                            </Form.Group>
                            <input type="submit" class="btn btn-primary btn-block btn-lg" value="Login" />
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