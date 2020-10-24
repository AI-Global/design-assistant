import React,{ Component } from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import "../css/signup.css";

const RegistrationDescription = `You can create an account for the Responsible AI Design Assistant! 
After creating your account, an email verfication will be sent to you.`

export default class Signup extends Component {
    constructor(props){
        super(props);
        this.state = {
            showSignupModal: false
        }
    }

    render(){
        const showSignup = this.state.showSignupModal;
        const handleClose = () => this.setState({showSignupModal: false});
        const handleShow = () => this.setState({showSignupModal: true});
        return(
            <>
                <a href="#" onClick={handleShow}> Create your account</a>

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
                        <Form>
                            <p className="description">
                                {RegistrationDescription}
                            </p>
                            <Form.Group controlId="formName">
                                <Form.Control type="text" placeholder="Name" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Control type="email" placeholder="Email" required="required"/>
                            </Form.Group>                  
                            <Form.Group controlId="formUsername">
                                <Form.Control type="text" placeholder = "Username" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Control type="password" placeholder="Password" required="required"/>
                            </Form.Group>
                            <Form.Group controlId="formPasswordConfirmation">
                                <Form.Control type="password" placeholder="Confirm Your Password" required="required"/>
                            </Form.Group>
                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Create My Account" />


                        </Form>
                    </Modal.Body>
            </Modal>
            </>
        )
    }
}