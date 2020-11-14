import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, Card } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import '../css/theme.css';


export default function ChildModal(props) {
    // console.log(numResponse)

    var currentQuestion = (props.current_question) ? props.current_question.question : "0";
    var previousQuestion = (props.previous_question) ? props.previous_question.question : "0";
    var responses = (props.previous_question && props.previous_question) ? props.previous_question.responses : [];

    const [makeChild, setMakeChild] = useState(false);
    const [checkedBoxes, setCheckedBoxes] = useState({})

    function close() {
        // reset the state
        setMakeChild(false);
        setCheckedBoxes({});
        props.onHide();
    }

    function save() {
        // saves the parent child relationship
        if (makeChild) {
            props.current_question.child = true;
            var parentId = props.previous_question._id;
            var parentQ = props.previous_question.question;
            var triggers = [];
            for (const [key, val] of Object.entries(checkedBoxes)) {
                if (val) {
                    triggers.push(key);
                }
            }
            props.current_question.trigger = { parent: parentId, responses: triggers, parentQuestion: parentQ };

            var endPoint = '/questions/' + props.current_question._id;
            axios.put(process.env.REACT_APP_SERVER_ADDR + endPoint, props.current_question)
                .then(res => {
                    const result = res.data;
                    if (result.errors) {
                        console.log(result.errors);
                    }
                    else {
                        console.log("Updated Question: ", result)
                    }
                })

        }
        setMakeChild(false);
        setCheckedBoxes({});
        props.clickYes();
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="modal-60w"
            backdrop="static"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Relationship
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-label">Would you like to form this question relationship:</div>
                <Row>
                    <Col md={12}>
                        <Card style={{ padding: "1em", backgroundColor: "#f5f5f5" }}>
                            <p style={{ fontSize: "12px", fontStyle: "italic", position: "relative", top: "-1em" }}>Parent</p>
                            {previousQuestion}
                        </Card>
                    </Col>
                </Row>
                <Row style={{ paddingTop: "0.5em" }}>
                    <Col md={1} style={{ paddingRight: "0", textAlign: "right" }}>
                        <SubdirectoryArrowRightIcon size="large" />
                    </Col>
                    <Col md={11} style={{ paddingLeft: "0" }}>
                        <Card style={{ padding: "1em", backgroundColor: "#f5f5f5" }}>
                            <p style={{ fontSize: "12px", fontStyle: "italic", position: "relative", top: "-1em" }}>Child</p>
                            {currentQuestion}
                        </Card>
                    </Col>
                </Row>
                <Form>
                    <Form.Group controlId="makeChild">
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 5 }}>
                                <div key='inline-radio' className="mb-3" style={{ paddingTop: "1.5em" }}>
                                    <Form.Check inline label="Yes" type='radio' checked={makeChild} id='inline-radio-1' onChange={() => setMakeChild(true)} />
                                    <Form.Check inline label="No" type='radio' checked={!makeChild} id='inline-radio-2' onChange={() => setMakeChild(false)} />
                                </div>
                            </Col>
                        </Row>
                    </Form.Group>
                    {!makeChild ? null :
                        <Form.Group>
                            <div className="form-label">Which response(s) should trigger the child question:</div>
                            <Row>
                                <Col md={12}>
                                    {responses.map((response, index) =>
                                        <Form.Check type="checkbox" key={index} id={response.responseNumber} label={response.indicator} checked={checkedBoxes[response.responseNumber]}
                                            onChange={() => {
                                                let temp = checkedBoxes;
                                                temp[response.responseNumber] = !checkedBoxes[response.responseNumber];
                                                setCheckedBoxes(temp);
                                            }} />
                                    )
                                    }
                                </Col>
                            </Row>
                        </Form.Group>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => close()} id="resetButton">Cancel</Button>
                <Button onClick={() => save()} id="saveButton">Confirm Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}