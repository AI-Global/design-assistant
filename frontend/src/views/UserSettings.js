import React,{ Component } from 'react';
import { Modal, DropdownButton, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
import { getLoggedInUser, expireAuthToken, getAuthToken} from '../helper/AuthHelper';
import "../css/usersettings.css";
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import axios from 'axios';

export default class UserSettings extends Component {
    constructor(props){
        super(props);
        this.state = {
            showEmailSettings: false,
            showUserNameSettings: false,
            showPasswordSettings: false,
            user: undefined,
            password: {isInvalid: false, message: ""},
            email: {isInvalid: false, message: ""},
            username: {isInvalid: false, message: ""},
            newPassword: {isInvalid: false, message: ""},
            passwordConfirmation: {isInvalid: false, message: ""},           
            
        }
    }

    componentDidMount() {
        getLoggedInUser().then( user => {
            this.setState({ user: user });
        })
    }

    changeEmailModal() {
        this.setState({showEmailSettings: true})
    }

    changeUsernameModal(){
        this.setState({showUserNameSettings: true})
    }

    changePasswordModal(){
        this.setState({showPasswordSettings: true})
    }

    /**
     * Expires the authorization tokens upon
     * log out button being clicked
     */
    handleLogout(){
        expireAuthToken();
        window.location.reload();
    }

    handleEmailSubmit(event){
        event.preventDefault();
        let form = event.target.elements;
        let newEmail = form.newEmail.value;
        let password = form.emailPassword.value;
        let authToken = getAuthToken();
        let endPoint = '/users/updateEmail';
        console.log(authToken);
        return axios.post(process.env.REACT_APP_SERVER_ADDR + endPoint,
            {
                newEmail: newEmail,
                password: password
            },
            {
            headers: {
                "x-auth-token": authToken
            }
        }).catch(err => {
            return false;
        }).then(response =>{
            window.location.reload();
        });    
    }

    handleUsernameSubmit(event){
        event.preventDefault();
        let form = event.target.elements;
        let newUsername = form.newUsername.value;
        let password = form.usernamePassword.value;
        let authToken = getAuthToken();
        let endPoint = '/users/updateUsername';
        return axios.post(process.env.REACT_APP_SERVER_ADDR + endPoint,
            {
                newUsername: newUsername,
                password: password
            },
            {
            headers: {
                "x-auth-token": authToken
            }
        }).catch(err => {
            return false;
        }).then(response =>{
            window.location.reload();
        });   
    }
    
    handlePasswordSubmit(event){
        event.preventDefault();
        let form = event.target.elements;
        let oldPassword = form.oldPassword.value;
        let newPassword = form.newPassword.value;
        let confirmPassword = form.confirmPassword.value;
        if(confirmPassword !== newPassword){

        }
        let authToken = getAuthToken();
        let endPoint = '/users/updatePassword';
        return axios.post(process.env.REACT_APP_SERVER_ADDR + endPoint,
            {
                password: oldPassword,
                newPassword: newPassword
            },
            {
            headers: {
                "x-auth-token": authToken
            }
        }).catch(err => {
            return false;
        }).then(response =>{
            window.location.reload();
        });    
    }

    updateUserToDB(user){
        
    }

    render(){
        const handleClose = () => this.setState({showEmailSettings: false, showUserNameSettings: false, showPasswordSettings: false});

        return (
            <span>
                <DropdownButton className="usersettings-dropdown"
                title={
                    <span>
                    <FontAwesomeIcon icon={faUserCog} size="lg" className="mr-2" cursor="pointer"/>
                    </span>
                }>
                    <DropdownItem onClick={() => this.changeEmailModal()}><i className="fa fa-envelope fa-fw"></i> Change Email</DropdownItem>
                    <DropdownItem onClick={() => this.changeUsernameModal()}><i className="fa fa-user fa-fw"></i> Change Username</DropdownItem>
                    <DropdownItem onClick={() => this.changePasswordModal()}><i className="fa fa-key fa-fw"></i> Change Password</DropdownItem>
                    <DropdownItem onClick={() => this.handleLogout()}><i className="fa fa-sign-out fa-fw"></i> Log Out</DropdownItem>
                </DropdownButton>


                <Modal show={this.state.showEmailSettings}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    dialogClassName="modal-login modal-dialog-centered">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Change Email
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => this.handleEmailSubmit(e)}>
                            <Form.Group controlId="newEmail">
                                <i className="fa fa-envelope"></i>
                                <Form.Control type="email" placeholder="New Email" required="required" autoComplete="email"/>
                                <Form.Control.Feedback type="invalid">
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="emailPassword">
                                <i className="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="Password" required="required" autoComplete="current-password"/>
                                <Form.Control.Feedback type="invalid">
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formSubmit">
                            </Form.Group>
                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Submit" />
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showUserNameSettings}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    dialogClassName="modal-login modal-dialog-centered">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Change Username
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => this.handleUsernameSubmit(e)}>
                            <Form.Group controlId="newUsername">
                                <i className="fa fa-user"></i>
                                <Form.Control type="text" placeholder="New Username" required="required" autoComplete="username"/>
                                <Form.Control.Feedback type="invalid">
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="usernamePassword">
                                <i className="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="Password" required="required" autoComplete="current-password"/>
                                <Form.Control.Feedback type="invalid">
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formSubmit">
                            </Form.Group>
                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Submit" />
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showPasswordSettings}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    dialogClassName="modal-login modal-dialog-centered">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Change Password
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => this.handlePasswordSubmit(e)}>
                            <Form.Group controlId="oldPassword">
                                <i className="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="Current Password" required="required" autoComplete="current-password"/>
                                <Form.Control.Feedback type="invalid">
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="newPassword">
                                <i className="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="New Password" required="required" autoComplete="password"/>
                                <Form.Control.Feedback type="invalid">
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="confirmPassword">
                                <i className="fa fa-lock"></i>
                                <Form.Control type="password" placeholder="Confirm New Password" required="required" autoComplete="password"/>
                                <Form.Control.Feedback type="invalid">
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formSubmit">
                            </Form.Group>
                            <input type="submit" className="btn btn-primary btn-block btn-lg" value="Submit" />
                        </Form>
                    </Modal.Body>
                </Modal>

            </span>
        )
    }
}
