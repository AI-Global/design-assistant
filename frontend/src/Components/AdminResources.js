import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Form, Col, Modal } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';


export default class AdminResources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trustedAIResources: [],
            showEditModal: false,
            currentIndex: undefined,
            showDeleteWarning: false
        }
    }

    deleteResource() {
        let trustedAIResources = this.state.trustedAIResources;
        let currentIndex = this.state.currentIndex;
        let endPoint = "/trustedAIResources/" + trustedAIResources[currentIndex]?._id;
        axios.delete(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(response => {
                trustedAIResources.splice(currentIndex, 1);
                this.setState({ trustedAIResources: trustedAIResources });
            });
        this.setState({ showDeleteWarning: false })
        this.setState({ showEditModal: false });
    }

    saveResource(event) {
        event.preventDefault();
        let form = event.target.elements;
        let trustedAIResources = this.state.trustedAIResources;
        let currentIndex = this.state.currentIndex;
        let endPoint = "/trustedAIResources/" + (trustedAIResources[currentIndex]?._id ?? "");
        let body = {
            resource: form.title.value,
            description: form.description.value,
            source: form.source.value
        };
        axios.put(process.env.REACT_APP_SERVER_ADDR + endPoint, body)
            .then(response => {
                let newResource = response.data;
                if (trustedAIResources[currentIndex]?._id) {
                    trustedAIResources[currentIndex] = newResource;
                }
                else {
                    trustedAIResources.unshift(newResource);
                }
                this.setState({ trustedAIResources: trustedAIResources });
            });
        this.setState({ showEditModal: false });
    }

    componentDidMount() {
        let endPoint = '/trustedAIResources'
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint).then(res => {
            this.setState({ trustedAIResources: res.data });
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        var trustedAIResources = this.state.trustedAIResources;
        var currentIndex = this.state.currentIndex;
        const showEdit = this.state.showEditModal;
        const handleClose = () => this.setState({ showDeleteWarning: false });
        const handleEditClose = () => this.setState({ showEditModal: false });
        const handleEditShow = (index) => this.setState({ showEditModal: true, currentIndex: index });
        return (
            <div>
                <Modal
                    centered
                    show={this.state.showDeleteWarning}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Warning!
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you would like to delete this Trusted AI Resource?
                </Modal.Body>
                    <Modal.Footer>
                        <Button id="DeleteSurveyButton" onClick={() => this.deleteResource()}>Yes</Button>
                        <Button onClick={() => handleClose()}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEdit}
                    centered
                    size="lg"
                    onHide={handleEditClose}
                    backdrop="static"
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Trusted AI Resource
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => this.saveResource(e)}>
                        <Modal.Body className="p-4">
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Title" required="required" autoComplete="text" isInvalid={false} aria-label="Title" defaultValue={trustedAIResources[currentIndex]?.resource} />
                                <Form.Control.Feedback type="invalid">
                                    { }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" placeholder="Description" autoComplete="text" isInvalid={false} aria-label="Description" defaultValue={trustedAIResources[currentIndex]?.description} />
                                <Form.Control.Feedback type="invalid">
                                    { }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="source">
                                <Form.Label>Source</Form.Label>
                                <Form.Control type="text" placeholder="Source" required="required" autoComplete="text" isInvalid={false} aria-label="Source" defaultValue={trustedAIResources[currentIndex]?.source} />
                                <Form.Control.Feedback type="invalid">
                                    { }
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Col md={9} className="mr-4">
                                <Button id="resetButton" onClick={() => { this.setState({ showDeleteWarning: true }) }}> Delete</Button>
                            </Col>
                            <Col md={2}>
                                <Button id="saveButton" type="submit" label="save" >Save</Button>
                            </Col>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Table bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th width="33%">Trusted AI Resource</th>
                            <th>Description</th>
                            <th className="text-center">
                                <IconButton aria-label="add resource" size="small" onClick={() => { handleEditShow(-1) }}><Add/></IconButton>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {trustedAIResources.map((resource, index) => {
                            return (
                                <tr key={index}>
                                    <td><a href={resource?.source}>{resource?.resource}</a></td>
                                    <td>{resource?.description}</td>
                                    <td><Button onClick={() => { handleEditShow(index) }}>Edit</Button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}
