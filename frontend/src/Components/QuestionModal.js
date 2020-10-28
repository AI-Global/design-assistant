import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import '../css/theme.css';


export default function QuestionModal(props) {
    var numResponse = props.question.responses.length
    var questionType = props.question.responseType

    const dimensions = ["Accountability", "Bias and Fairness", "Explainability and Interpretability", "Robustness", "Data Quality"]
    // console.log(numResponse)
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="modal-60w"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Question
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row>
                        <Col xs={12} md={1} />
                        {/* <Col xs={12} md={1}>
                            <Form.Group controlId="formNumber">
                                <Form.Label>No.</Form.Label>
                                <Form.Control type="number" placeholder="No." defaultValue={props.question.questionNumber} />
                            </Form.Group>
                        </Col> */}
                        <Col xs={10} md={2}>
                            <Form.Group controlId="formDimension">
                                <Form.Label>Dimension</Form.Label>
                                <Form.Control  as="select">
                                    <option value="0">Choose...</option>
                                    {dimensions.map((dimension, index) =>
                                        <option key={index+1} value={index+1}>{dimension}</option>
                                    )}
                                </Form.Control>

                            </Form.Group>
                        </Col>
                        <Col xs={10} md={2}>
                            <Form.Group controlId="formType">
                                <Form.Label>Question Type</Form.Label>
                                <Form.Control as="select">
                                    <option>Text</option>
                                    <option>Checkbox</option>
                                    <option>Radio Group</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={10} md={1}>
                            <Form.Group controlId="formResponseNumber">
                                <Form.Label>Choices</Form.Label>
                                <Form.Control type="number" defaultValue={numResponse} />
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={1}>
                            <Form.Label>Points</Form.Label>
                            <Form.Control type="number" placeholder="Points" defaultValue={props.question ? props.question.pointsAvailable : "Points"}></Form.Control>
                        </Col>
                        <Col xs={6} md={1}>
                            <Form.Label>Weighting</Form.Label>
                            <Form.Control type="number" placeholder="Weighting" defaultValue={props.question ? props.question.weighting : "PWeighting"}></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={1} />
                        <Col xs={12} md={10}>
                            <Form.Group controlId="formQuestion">
                                <Form.Label>Question</Form.Label>
                                <Form.Control as="textarea" placeholder="Question" defaultValue={props.question.question} />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={1} />
                    </Row>

                    <Row>
                        <Col xs={6} md={1} />
                        <Col xs={6} md={9}>
                            <Form.Group controlId="formResponses">
                                <Form.Label>Responses</Form.Label>
                                {props.question.responses.map((response, index) =>
                                    <div key={index} style={{ "paddingBottom": "0.5em" }}>
                                        <Form.Control defaultValue={response.indicator} />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={1}>
                            <Form.Group controlId="formScore">
                                <Form.Label>Score</Form.Label>
                                {props.question.responses.map((response, index) =>
                                    <div key={index} style={{ "paddingBottom": "0.5em" }}>
                                        <Form.Control type="text" defaultValue={response.score}></Form.Control>
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={1} />
                        <Col xs={6} md={2}>
                            <Form.Group>
                                <Form.Label>Role</Form.Label>
                                <Form.Control as="select">
                                    <option>All</option>
                                    <option>Role 1</option>
                                    <option>Role 2</option>
                                    <option>Role 3</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Group>
                                <Form.Label>Domain</Form.Label>
                                <Form.Control as="select">
                                    <option>Domain</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Group>
                                <Form.Label>Region</Form.Label>
                                <Form.Control as="select">
                                    <option>Region</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Group>
                                <Form.Label>Life-Cycle</Form.Label>
                                <Form.Control as="select">
                                    <option>Life-Cycle</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={1} />
                        <Col xs={6} md={10}>
                            <Form.Group controlId="formResponses">
                                <Form.Label>Help Text</Form.Label>
                                <Form.Control as="textarea" placeholder="Help text" defaultValue={(props.question.alt_text === "\r") ? "" : props.question.alt_text} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-start col">
                    <Button id="resetButton">Delete</Button>
                </div>
                <Button onClick={props.onHide}>Close</Button>
                <Button id="saveButton">Save</Button>
            </Modal.Footer>
        </Modal>
    );
}