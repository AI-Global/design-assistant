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
    const responseTypes = ["text", "comment", "dropdown", "radiogroup", "checkbox", "slider"]

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
    const [responseType, setType] = useState(props.question.responseType)
    const [responses, setResponses] = useState(responsesA)
    const [questionRole, setRole] = useState(props.question.roles)
    const [dimension, setDimension] = useState(props.question.trustIndexDimension)
    const [weight, setWeight] = useState(props.question.weighting)
    const [questionType, setQType] = useState(props.question.questionType)
    const [questionLink, setLink] = useState("")

    // Hook for showing delet quesiton warning
    const [warningShow, setWarningShow] = useState(false)
    const [questionValid, setInvalid] = useState(false)

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
        setQType(props.question.questionType)
        revertIndicators(props.question.responses)
        setRole(props.question.roles)
        setDimension(props.question.trustIndexDimension)
        setWeight(props.question.weighting)
        setInvalid(false)
        props.onHide()
    }

    function save(event) {
        event.preventDefault();
        if (event.target.elements.question.value === "") {
            setInvalid(true)
        } else {
            var endPoint
            props.question.alt_text = altText
            props.question.lifecycle = questionLifecycle
            props.question.pointsAvailable = points
            props.question.question = question
            props.question.reference = questionRef
            props.question.responseType = responseType
            props.question.questionType = questionType
            props.question.responses = responses
            props.question.roles = questionRole
            dimension === -1 ? props.question.trustIndexDimension = null : props.question.trustIndexDimension = dimension
            props.question.weighting = weight
            props.question.trigger = null;

            if (props.mode === "edit") {
                endPoint = '/questions/' + props.question._id;
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
            } else {
                endPoint = '/questions/';
                axios.post(process.env.REACT_APP_SERVER_ADDR + endPoint, props.question)
                    .then(res => {
                        const result = res.data;
                        if (result.errors) {
                            console.log(result.errors);
                        }
                        else {
                            console.log("Added Question: ", result)
                        }
                    })
                // need to clear question metadata before closing for adding action
                props.question.alt_text = null
                props.question.lifecycle = 6
                props.question.pointsAvailable = 0
                props.question.question = null
                props.question.reference = questionRef
                props.question.responseType = "text"
                props.question.questionType = "tombstone"
                props.question.responses = []
                props.question.roles = [13]
                props.question.trustIndexDimension = null
                props.question.weighting = 0
                props.question.trigger = null;
                close()
            }
        }
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
                    Are you sure you would like to delete this quesiton?
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
                    <Form onSubmit={(e) => save(e)} noValidate>
                        <Row>
                            <Col xs={4} md={3}>
                                <Form.Group controlId="questionDimension">
                                    <Form.Label>Dimension</Form.Label>
                                    <Form.Control value={dimension === null ? "" : dimension} as="select" onChange={(event) => setDimension(parseInt(event.target.value))}>
                                        <option value="-1">Details</option>
                                        {Object.values(dimensions).map((dimension, index) =>
                                            <option key={index + 1} value={index + 1} data-testid={dimension.name}>{dimension.name}</option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4} md={2}>
                                <Form.Group controlId="responseType">
                                    <Form.Label>Response Type</Form.Label>
                                    <Form.Control data-testid="responseType" value={responseType || ''} as="select" onChange={(event) => setType(event.target.value)}>
                                        {responseTypes.map((type, index) =>
                                            <option key={index} value={type}>{type}</option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4} md={2}>
                                <Form.Group controlId="questionType">
                                    <Form.Label>Question Type</Form.Label>
                                    <Form.Control data-testid="questionType" value={questionType || ''} as="select" onChange={(event) => setQType(event.target.value)}>
                                        <option>tombstone</option>
                                        <option>mitigation</option>
                                        <option>risk</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            {(responseType === "radiogroup" || responseType === "checkbox") ?
                                <React.Fragment>
                                    <Col xs={4} md={2}>
                                        <Form.Label>Points</Form.Label>
                                        <Form.Control value={points} as="select" onChange={(event) => setPoints(event.target.value)}>
                                            <option value={-1}>-1</option>
                                            <option value={0}>0</option>
                                            <option value={1}>1</option>
                                        </Form.Control>
                                    </Col>
                                    <Col xs={4} md={2}>
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Control value={weight} as="select" onChange={(event) => setWeight(event.target.value)}>
                                            <option>0</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                        </Form.Control>
                                    </Col>
                                </React.Fragment>
                                : null}
                        </Row>
                        <Row>
                            <Col xs={12} md={12}>
                                <Form.Group controlId="question">
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control data-testid="question" required="required" isInvalid={questionValid} as="textarea" placeholder="Question" value={question || ""} onChange={(event) => setQuestion(event.target.value)} />
                                    <Form.Control.Feedback type="invalid">Please enter a question</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        {(responseType === "comment" || responseType === "text" || responseType === "dropdown") ? null :
                            <Row>
                                <Col xs={11} md={11} style={{ display: "inline-block" }}>
                                    <Form.Group controlId="responses">
                                        <Form.Label>
                                            Responses
                                            <IconButton aria-label="add response" size="small" style={{ "marginLeft": "0.3em" }} onClick={() => { addResponse(responses) }}>
                                                <Add style={{ color: green[500] }} />
                                            </IconButton>
                                        </Form.Label>
                                        {responses.map((response, index) =>
                                            <div key={index} style={{ paddingBottom: "0.5em" }}>
                                                <InputGroup className="mb-2" style={{ "minHeight": "44px" }}>
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
                                    <Form.Group controlId="responseScore">
                                        <Form.Label style={{ paddingBottom: "4px" }}> {/*  */}
                                        Score
                                    </Form.Label>
                                        {responses.map((response, index) =>
                                            <div key={index} style={{ paddingBottom: "1em" }}>
                                                <Form.Control type="number" placeholder="0" value={response.score || ''} style={{ "minHeight": "44px" }} onChange={(event) => editScore(event.target.value, index, response.indicator)} ></Form.Control>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                        }
                        {questionType === "tombstone" ? null :
                            <Row>
                                <Col xs={2} md={2}>
                                    <Form.Group controlId="roles">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Control value={rolesJSON[questionRole - 1].name || ''} as="select" onChange={(event) => setRole(event.target.selectedIndex)}>
                                            <option>Choose...</option>
                                            {rolesJSON.map((role, index) =>
                                                <option key={index} value={role.name}>{role.name}</option>
                                            )}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={2} md={2}>
                                    <Form.Group controlId="domains">
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
                                    <Form.Group controlId="regions">
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
                                    <Form.Group controlId="lifecycles">
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
                        }
                        <Row>
                            <Col xs={12} md={12}>
                                <Form.Group controlId="altText">
                                    <Form.Label>Alt Text</Form.Label>
                                    <Form.Control as="textarea" placeholder="Alt text" value={altText || ""} onChange={(event) => setAltText(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        {questionType === "tombstone" ? null :
                            <React.Fragment>
                                <Row>
                                    <Col xs={12} md={12}>
                                        <Form.Group controlId="Reference">
                                            <Form.Label>Reference</Form.Label>
                                            <Form.Control as="textarea" placeholder="Reference" value={questionRef || ""} onChange={(event) => setRef(event.target.value)} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={12}>
                                        <Form.Group controlId="Link">
                                            <Form.Label>Link</Form.Label>
                                            <Form.Control placeholder="Link" value={questionLink || ""} onChange={(event) => setLink(event.target.value)}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </React.Fragment>
                        }
                        <div id="modal-footer-border" />
                        <div id="modal-footer" alt_text="footer">
                            <Button id="resetButton" onClick={() => setWarningShow(true)}>Delete</Button>
                            <Button id="saveButton" type="submit" label="save">Save</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}