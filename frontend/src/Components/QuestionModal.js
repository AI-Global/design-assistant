import '../css/theme.css';
import React from 'react';
import Add from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal';
import IconButton from '@material-ui/core/IconButton';
import { Button, Form, Row, Col } from 'react-bootstrap';


export default function QuestionModal(props) {
    const responseType = ["text", "comment", "dropdown", "radiogroup", "checkbox", "slider"]

    // TODO: replace constants and JSON files with backend calls
    const dimensionJSON = require('../tempJSON/dimensionJSON.json')
    const domainJSON = require('../tempJSON/domainJSON.json')
    const lifecycleJSON = require('../tempJSON/lifecycleJSON.json')
    const regionJSON = require('../tempJSON/regionJSON.json')
    const rolesJSON = require('../tempJSON/rolesJSON.json')


    const [questionType, setType] = React.useState(props.question.responseType)
    const [questionRole, setRole] = React.useState(rolesJSON[props.question.roles].name)
    const [questionLifecycle, setLifecycle] = React.useState(lifecycleJSON[props.question.lifecycle].name)
    const [responses, setResponses] = React.useState(props.question.responses)
    // const [questionDomain, setDomain] = React.useState(domainJSON[props.question.domainApplicability].name)
    // const [questionRegion setRegion] = React.useState(regionJSON[props.question.regionalApplicability].name)

    // console.log(questionRole)
    // console.log(questionType)
    // console.log(questionLifecycle)
    console.log(responses)

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
                        <Col xs={10} md={2}>
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
                        <Col xs={10} md={2}>
                            <Form.Group controlId="formType">
                                <Form.Label>Question Type</Form.Label>
                                <Form.Control defaultValue={questionType} as="select" onChange={(event) => setType(event.target.value)}> {/*console.log(event.target.value) */}
                                    <option>Choose...</option>
                                    {responseType.map((type, index) =>
                                        <option key={index} value={type}>{type}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {(questionType === "radiogroup" || questionType === "checkbox") ?
                            <React.Fragment>
                                {/* <Col xs={10} md={1}>
                                    <Form.Group controlId="formResponseNumber">
                                        <Form.Label>Choices</Form.Label>
                                        <Form.Control type="number" defaultValue={numResponse} />
                                    </Form.Group>
                                </Col> */}
                                <Col xs={6} md={1}>
                                    <Form.Label>Points</Form.Label>
                                    <Form.Control type="number" placeholder="Points" defaultValue={props.question ? props.question.pointsAvailable : "Points"}></Form.Control>
                                </Col>
                                <Col xs={6} md={1}>
                                    <Form.Label>Weighting</Form.Label>
                                    <Form.Control type="number" placeholder="Weighting" defaultValue={props.question ? props.question.weighting : "Weighting"}></Form.Control>
                                </Col>
                            </React.Fragment>
                            : null}
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
                    {(questionType === "comment" || questionType === "text" || questionType === "dropdown") ? null :
                        <Row>
                            <Col xs={6} md={1} />
                            <Col xs={6} md={9}>
                                <Form.Group controlId="formResponses">
                                    <Form.Label>Responses
                                                <IconButton aria-label="add response" size="small" style={{ "marginLeft": "0.5em"}}><Add /></IconButton>
                                    </Form.Label>
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
                                    {responses.map((response, index) =>
                                        <div key={index} style={{ "paddingBottom": "0.5em" }}>
                                            <Form.Control type="text" defaultValue={response.score}></Form.Control>
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col xs={6} md={1} />
                        <Col xs={6} md={2}>
                            <Form.Group>
                                <Form.Label>Role</Form.Label>
                                <Form.Control defaultValue={questionRole} as="select" onChange={(event) => setRole(event.target.value)}>
                                    {rolesJSON.map((role, index) =>
                                        <option key={index} value={role.name}>{role.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={2}>
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
                        <Col xs={6} md={2}>
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
                        <Col xs={6} md={2}>
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