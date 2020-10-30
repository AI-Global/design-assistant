import '../css/theme.css';
import React, { useState } from 'react';
import Add from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { green, red } from '@material-ui/core/colors';
import InputGroup from 'react-bootstrap/InputGroup'

export default function QuestionModal(props) {
    const responseType = ["text", "comment", "dropdown", "radiogroup", "checkbox", "slider"]

    // TODO: replace constants and JSON files with backend calls
    const dimensionJSON = require('../tempJSON/dimensionJSON.json')
    const domainJSON = require('../tempJSON/domainJSON.json')
    const lifecycleJSON = require('../tempJSON/lifecycleJSON.json')
    const regionJSON = require('../tempJSON/regionJSON.json')
    const rolesJSON = require('../tempJSON/rolesJSON.json')

    const [questionType, setType] = useState(props.question.responseType)
    const [questionRole, setRole] = useState(rolesJSON[props.question.roles].name)
    const [questionLifecycle, setLifecycle] = useState(lifecycleJSON[props.question.lifecycle].name)
    const [responses, setResponses] = useState(props.question.responses)
    // const [questionDomain, setDomain] = useState(domainJSON[props.question.domainApplicability].name)
    // const [questionRegion setRegion] = useState(regionJSON[props.question.regionalApplicability].name)

    function addResponse(response) {
        // add new response object to responses and rerender response section by spreading the array into a new array
        // problem: https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
        // solution by ray hatfield: https://stackoverflow.com/a/56266640
        response[response.length] = { "responseNumber": response.length, "indicator": "", "score": "" }
        setResponses([...response])
    }

    function removeResponse(index) {
        console.log(responses, index)
        delete responses[index]
        const newResponse = responses.filter(function (i) { return i; })
        console.log(newResponse)
        setResponses(newResponse)
        setResponses([...newResponse])
    }

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
                        <Col xs={4} md={2}>
                            <Form.Group controlId="formDimension">
                                <Form.Label>Dimension</Form.Label>
                                <Form.Control defaultValue={props.question.trustIndexDimension} as="select">
                                    <option>Choose...</option>
                                    {dimensionJSON.map((dimension, index) =>
                                        <option key={index} value={index}>{dimension.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={4} md={2}>
                            <Form.Group controlId="formType">
                                <Form.Label>Question Type</Form.Label>
                                <Form.Control defaultValue={questionType} as="select" onChange={(event) => setType(event.target.value)}>
                                    <option>Choose...</option>
                                    {responseType.map((type, index) =>
                                        <option key={index} value={type}>{type}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {(questionType === "radiogroup" || questionType === "checkbox") ?
                            <React.Fragment>
                                <Col xs={4} md={1}>
                                    <Form.Label>Points</Form.Label>
                                    <Form.Control type="number" placeholder="Points" defaultValue={props.question ? props.question.pointsAvailable : "Points"}></Form.Control>
                                </Col>
                                <Col xs={4} md={1}>
                                    <Form.Label>Weighting</Form.Label>
                                    <Form.Control type="number" placeholder="Weighting" defaultValue={props.question ? props.question.weighting : "Weighting"}></Form.Control>
                                </Col>
                            </React.Fragment>
                            : null}
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            <Form.Group controlId="formQuestion">
                                <Form.Label>Question</Form.Label>
                                <Form.Control as="textarea" placeholder="Question" defaultValue={props.question.question} />
                            </Form.Group>
                        </Col>
                    </Row>
                    {(questionType === "comment" || questionType === "text" || questionType === "dropdown") ? null :
                        <Row>
                            <Col xs={11} md={11} style={{ display: "inline-block" }}>
                                <Form.Group controlId="formResponses">
                                    <Form.Label>
                                        Responses
                                        <IconButton aria-label="add response" size="small" style={{ "marginLeft": "0.3em" }} onClick={() => { addResponse(responses) }}>
                                            <Add style={{ color: green[500] }} />
                                        </IconButton>
                                    </Form.Label>
                                    {responses.map((response, index) =>
                                        <div key={index} style={{ paddingBottom: "0.5em" }}>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>
                                                        <IconButton size="small" color="secondary" onClick={() => { removeResponse(index) }}>
                                                            <DeleteIcon key={index} style={{ color: red[500] }} />
                                                        </IconButton>
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control style={{ height: "inherit" }} value={response.indicator} onChange={() => { setResponses(response) }} />
                                            </InputGroup>
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col xs={1} md={1}>
                                <Form.Group controlId="formScore">
                                    <Form.Label style={{ paddingBottom: "4px" }}>Score</Form.Label>
                                    {responses.map((response, index) =>
                                        <div key={index} style={{ paddingBottom: "15px" }}>
                                            <Form.Control type="text" defaultValue={response.score} style={{ height: "39.5px" }}></Form.Control>
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col xs={2} md={2}>
                            <Form.Group>
                                <Form.Label>Role</Form.Label>
                                <Form.Control defaultValue={questionRole} as="select" onChange={(event) => setRole(event.target.value)}>
                                    {rolesJSON.map((role, index) =>
                                        <option key={index} value={role.name}>{role.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2} md={2}>
                            <Form.Group>
                                <Form.Label>Domain</Form.Label>
                                {/* TODO: update default value when questions have domain */}
                                <Form.Control defaultValue="Other" as="select">
                                    {domainJSON.map((domain, index) =>
                                        <option key={index} value={domain.name}>{domain.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2} md={2}>
                            <Form.Group>
                                <Form.Label>Region</Form.Label>
                                {/* TODO: update default value when questions have region */}
                                <Form.Control defaultValue="Other" as="select">
                                    {regionJSON.map((region, index) =>
                                        <option key={index} value={region.name}>{region.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2} md={2}>
                            <Form.Group>
                                <Form.Label>Life-Cycle</Form.Label>
                                <Form.Control defaultValue={questionLifecycle} as="select" onChange={(event) => setLifecycle(event.target.value)}>
                                    {lifecycleJSON.map((lifecycle, index) =>
                                        <option key={index} value={lifecycle.name}>{lifecycle.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            <Form.Group controlId="formResponses">
                                <Form.Label>Help Text</Form.Label>
                                <Form.Control as="textarea" placeholder="Help text" defaultValue={(props.question.alt_text === "\r") ? "" : props.question.alt_text} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <div id="modal-footer-border"/>
                <div id="modal-footer" alt_text="footer">
                    <Button id="resetButton">Delete</Button>
                    <Button id="saveButton">Save</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}