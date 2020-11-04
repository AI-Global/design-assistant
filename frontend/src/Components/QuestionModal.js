import '../css/theme.css';
import axios from 'axios';
import React, { useState } from 'react';
import Add from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import InputGroup from 'react-bootstrap/InputGroup';
import IconButton from '@material-ui/core/IconButton';
import { green, red } from '@material-ui/core/colors';
import { Button, Form, Row, Col } from 'react-bootstrap';


export default function QuestionModal(props) {
    const responseType = ["text", "comment", "dropdown", "radiogroup", "checkbox", "slider"]

    // TODO: replace constants and JSON files with API calls to get JSON's from DB
    const dimensions = props.dimensions
    const domainJSON = require('../tempJSON/domainJSON.json')
    const lifecycleJSON = require('../tempJSON/lifecycleJSON.json')
    const regionJSON = require('../tempJSON/regionJSON.json')
    const rolesJSON = require('../tempJSON/rolesJSON.json')


    // make copy of responses array so we can revert back to it if needed
    const responsesA = [...props.question.responses]
    // Set all question properties as hooks for rendering and updating
    const [altText, setAltText] = useState(props.question.alt_text)
    // const [questionDomain, setDomain] = useState(domainJSON[props.question.domainApplicability].name)
    const [questionLifecycle, setLifecycle] = useState(props.question.lifecycle)
    const [points, setPoints] = useState(props.question.pointsAvailable)
    const [question, setQuestion] = useState(props.question.question)
    const [questionRef, setRef] = useState(props.question.reference)
    // const [questionRegion setRegion] = useState(regionJSON[props.question.regionalApplicability].name)
    const [questionType, setType] = useState(props.question.responseType)
    const [responses, setResponses] = useState(responsesA)
    const [questionRole, setRole] = useState(props.question.roles)
    const [dimension, setDimension] = useState(props.question.trustIndexDimension)
    const [weight, setWeight] = useState(props.question.weighting)

    const [warningShow, setWarningShow] = useState(false)

    function addResponse(response) {
        // add new response object to responses and rerender response section by spreading the array into a new array
        // problem: https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
        // solution by ray hatfield: https://stackoverflow.com/a/56266640
        response[response.length] = { "responseNumber": response.length, "indicator": "", "score": "" }
        setResponses([...response])
    }

    function removeResponse(index) {
        const newResponse = responses.filter(function (e) { return e.responseNumber !== index; })
        for (var i in newResponse) {
            newResponse[i].responseNumber = parseInt(i)
        }
        setResponses(newResponse)
        setResponses([...newResponse])
    }

    function editIndicator(indicator, index, score) {
        responses[index] = { "responseNumber": index, "indicator": indicator, "score": score }
        setResponses([...responses])
    }

    function revertIndicators(r) {
        for (var i in r) {
            r[i].responseNumber = parseInt(i)
        }
        setResponses([...r])
    }

    function editScore(score, index, indicator) {
        responses[index] = { "responseNumber": index, "indicator": indicator, "score": score }
        setResponses([...responses])
    }

    function close() {
        // if modal close button is clicked, edits will not be saved, so revert all values to default
        setAltText(props.question.alt_text)
        setLifecycle(props.question.lifecycle)
        setPoints(props.question.pointsAvailable)
        setQuestion(props.question.question)
        setRef(props.question.reference)
        setType(props.question.responseType)
        revertIndicators(props.question.responses)
        setRole(props.question.roles)
        setDimension(props.question.trustIndexDimension)
        setWeight(props.question.weighting)
        props.onHide()
    }

    function save() {
        var endPoint = '/questions/' + props.question._id;
        props.question.alt_text = altText
        props.question.lifecycle = questionLifecycle
        props.question.pointsAvailable = points
        props.question.question = question
        props.question.reference = questionRef
        props.question.responseType = questionType
        props.question.responses = responses
        props.question.roles = questionRole
        dimension === -1 ? props.question.trustIndexDimension = null : props.question.trustIndexDimension = dimension
        props.question.weighting = weight
        axios.put(process.env.REACT_APP_SERVER_ADDR + endPoint, props.question)
            .then(res => {
                const result = res.data;
                if (result.errors) {
                    console.log(result.errors);
                }
                else {
                    console.log("Updated Question: ", result)
                }
            })
        props.onHide()
    }

    function deleteQuestion() {
        var endPoint = '/questions/' + props.question._id;
        axios.delete(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(res => {
                const result = res.data;
                if (result.errors) {
                    console.log(result.errors);
                }
                else {
                    console.log("Delete Question: ", result)
                }
            })
        setWarningShow(false)
        props.onHide()
    }

    if (!dimensions) {
        return null;
    }

    return (
        <React.Fragment>
            <Modal
                {...props}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={warningShow}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Warning!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you would like to delte this quesiton?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => deleteQuestion()}>Yes</Button>
                    <Button onClick={() => setWarningShow(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal
                {...props}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                dialogClassName="modal-60w"
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Question
                </Modal.Title>
                    <IconButton size="small" onClick={() => close()} label="Close">
                        <CloseIcon />
                    </IconButton>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={4} md={3}>
                                <Form.Group controlId="formDimension">
                                    <Form.Label>Dimension</Form.Label>
                                    <Form.Control value={dimension === null ? "" : dimension} as="select" onChange={(event) => setDimension(parseInt(event.target.value))}>
                                        <option value="-1">Details</option>
                                        {Object.values(dimensions).map((dimension, index) =>
                                            <option key={index + 1} value={index + 1}>{dimension.name}</option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4} md={2}>
                                <Form.Group controlId="formType">
                                    <Form.Label>Response Type</Form.Label>
                                    <Form.Control value={questionType || ''} as="select" onChange={(event) => setType(event.target.value)}>
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
                                        <Form.Control type="number" placeholder="--" value={points} onChange={(event) => setPoints(event.target.value)} />
                                    </Col>
                                    <Col xs={4} md={1}>
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Control type="number" placeholder="--" value={weight} onChange={(event) => setWeight(event.target.value)} />
                                    </Col>
                                </React.Fragment>
                                : null}
                        </Row>
                        <Row>
                            <Col xs={12} md={12}>
                                <Form.Group controlId="formQuestion">
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control as="textarea" placeholder="Question" value={question || ""} onChange={(event) => setQuestion(event.target.value)} />
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
                                                    <Form.Control type="text" placeholder="Response" value={response.indicator} style={{ height: "inherit" }} onChange={(event) => editIndicator(event.target.value, index, response.score)} />
                                                </InputGroup>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={1} md={1}>
                                    <Form.Group controlId="formScore">
                                        <Form.Label style={{ paddingBottom: "4px" }}> {/*  */}
                                        Score
                                    </Form.Label>
                                        {responses.map((response, index) =>
                                            <div key={index} style={{ paddingBottom: "15px" }}>
                                                <Form.Control type="number" placeholder="--" value={response.score || ''} style={{ height: "39.5px" }} onChange={(event) => editScore(event.target.value, index, response.indicator)} ></Form.Control>
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
                                    <Form.Control defaultValue={rolesJSON[questionRole - 1].name} as="select" onChange={(event) => setRole(event.target.selectedIndex)}>
                                        <option>Choose...</option>
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
                                    <Form.Control defaultValue={lifecycleJSON[questionLifecycle - 1].name} as="select" onChange={(event) => setLifecycle(event.target.selectedIndex)}>
                                        <option>Choose...</option>
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
                                    <Form.Label>Alt Text</Form.Label>
                                    <Form.Control as="textarea" placeholder="Alt text" value={altText || ""} onChange={(event) => setAltText(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12}>
                                <Form.Group controlId="formResponses">
                                    <Form.Label>Reference</Form.Label>
                                    <Form.Control as="textarea" placeholder="Reference" value={questionRef || ""} onChange={(event) => setRef(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div id="modal-footer-border" />
                        <div id="modal-footer" alt_text="footer">
                            <Button id="resetButton" onClick={() => setWarningShow(true)}>Delete</Button>
                            <Button id="saveButton" onClick={() => save()} label="save">Save</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}