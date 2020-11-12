import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormCheck } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import '../css/theme.css';


export default function ChildModal(props) {
    // console.log(numResponse)

    var currentQuestion = (props.current_question) ? props.current_question.question : "0";
    var previousQuestion = (props.previous_question) ? props.previous_question.question : "0";

    const [responses, setResponses] = useState(props.previous_question.responses);
    const [makeChild, setMakeChild] = useState(false);

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="modal-30w"
        >
            <Modal.Header closeButton>
                <Form>
                    <Form.Group controlId="makeChild">
                    <Row>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Make "{currentQuestion}" a child question of "{previousQuestion}"?
                    </Modal.Title>
                    </Row>
                    <Col sm="12" md={{ size: 6, offset: 5 }}>
                        <Row>
                            <div key='inline-radio' classname="mb-3">
                                <Form.Check inline label="Yes" type='radio' checked={makeChild} id='inline-radio-1' onChange={() => setMakeChild(true)}/>
                                <Form.Check inline label="No" type='radio' checked ={!makeChild} id='inline-radio-2' onChange={() => setMakeChild(false)}/>
                            </div>
                        </Row>
                    </Col>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <div classname='mb-3'>
                                { responses.map( (response) =>
                                <Form.Check type="checkbox" id={response.responseNumber} label={response.indicator}/>
                                )
                                }
                            </div>
                        </Row>
                    </Form.Group>
                </Form>
            </Modal.Header>
            <Modal.Footer>
                <Button onClick={props.onHide} id="resetButton">Cancel</Button>
                <Button onClick={props.clickYes} id="saveButton">Confirm Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}