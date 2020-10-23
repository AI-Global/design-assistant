import React,{ Component } from 'react';
import { Row, Col, Button, Form, Tab} from 'react-bootstrap';
import { useHistory } from 'react-router';

const RegistrationDescription = `You can create an account for the Responsible AI Design Assistant! 
After creating your account, an email verfication will be sent to you.`

export default class Signup extends Component {

    render(){
        return(
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">
                    User Registration
                </h1>
                <Row tyle={{ marginTop: '4rem' }}>
                    <Col style={{
                        backgroundColor: '#fff',
                        padding: '26px',   
                        minWidth:'700px'  
                    }}>
                        <Form>
                            <p>
                                {RegistrationDescription}
                            </p>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name"/>
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Email" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>                  
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder = "Username"/>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Form.Group controlId="formPasswordConfirmation">
                                <Form.Label>Confirm Your Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm Your Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>


                        </Form>
                    </Col>
                </Row>
            </main>
        )
    }
}