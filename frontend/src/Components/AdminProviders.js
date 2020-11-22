import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';


export default class AdminProviders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trustedAIProviders: [],
            showEditModal: false,
            currentIndex: undefined,
            showDeleteWarning: false,
            source: {}
        }
    }

    // retrieves the list of trusted ai providers that can be edited
    componentDidMount() {
        let endPoint = '/trustedAIProviders'
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint).then(res => {
            this.setState({ trustedAIProviders: res.data });
        }).catch(err => {
            console.log(err);
        })
    }

    // upon confirmation of delete, sends the id of the trusted ai provider to backend to be deleted
    deleteProvider() {
        let trustedAIProviders = this.state.trustedAIProviders;
        let currentIndex = this.state.currentIndex;
        let endPoint = "/trustedAIProviders/" + trustedAIProviders[currentIndex]?._id;
        if (currentIndex !== -1) {
            axios.delete(process.env.REACT_APP_SERVER_ADDR + endPoint)
                .then(response => {
                    trustedAIProviders.splice(currentIndex, 1);
                    this.setState({ trustedAIProviders: trustedAIProviders });
                });
        }
        this.setState({ showDeleteWarning: false })
        this.setState({ showEditModal: false });
    }

    /**
     *  upon submission of the form, sends updated/new trusted ai provider to backend to
     *  be validated and saved in DB then updates the list of trusted ai providers for admin view
    */
    saveProvider(event) {
        event.preventDefault();
        let form = event.target.elements;
        let trustedAIProviders = this.state.trustedAIProviders;
        let currentIndex = this.state.currentIndex;
        let endPoint = "/trustedAIProviders/" + (trustedAIProviders[currentIndex]?._id ?? "");
        let body = {
            resource: form.title.value,
            description: form.description.value,
            source: form.source.value
        };
        axios.put(process.env.REACT_APP_SERVER_ADDR + endPoint, body)
            .then(response => {
                let newProvider = response.data;
                if (trustedAIProviders[currentIndex]?._id) {
                    trustedAIProviders[currentIndex] = newProvider;
                }
                else {
                    trustedAIProviders.unshift(newProvider);
                }
                this.setState({ trustedAIProviders: trustedAIProviders });
                this.setState({ showEditModal: false });
            }).catch(err => {
                this.setState(err.response.data);
            });
    }

    render() {
        var trustedAIProviders = this.state.trustedAIProviders;
        var currentIndex = this.state.currentIndex;
        const showEdit = this.state.showEditModal;
        const handleClose = () => this.setState({ showDeleteWarning: false });
        const handleEditClose = () => this.setState({ showEditModal: false });
        const handleEditShow = (index) => this.setState({ showEditModal: true, currentIndex: index, source: {} });
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
                        Are you sure you would like to delete this Trusted AI Provider?
                </Modal.Body>
                    <Modal.Footer>
                        <Button id="DeleteSurveyButton" onClick={() => this.deleteProvider()}>Yes</Button>
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
                            Trusted AI Provider
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => this.saveProvider(e)}>
                        <Modal.Body className="p-4">
                            <Form.Group controlId="title">
                                <Form.Label className="edit-trusted-form-label">Title</Form.Label>
                                <Form.Control type="text" placeholder="Title" required="required" autoComplete="text" aria-label="Title" defaultValue={trustedAIProviders[currentIndex]?.resource} />
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label className="edit-trusted-form-label">Description</Form.Label>
                                <Form.Control as="textarea" placeholder="Description" autoComplete="text" aria-label="Description" defaultValue={trustedAIProviders[currentIndex]?.description} />
                            </Form.Group>
                            <Form.Group controlId="source">
                                <Form.Label className="edit-trusted-form-label">Source</Form.Label>
                                <Form.Control type="text" placeholder="Source" required="required" autoComplete="text" isInvalid={this.state.source?.isInvalid} aria-label="Source" defaultValue={trustedAIProviders[currentIndex]?.source} />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.source?.message}
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
                        <tr className="edit-trusted-headers">
                            <th width="33%">Trusted AI Provider</th>
                            <th>Description</th>
                            <th className="text-center">
                                <IconButton aria-label="add provider" size="small" onClick={() => { handleEditShow(-1) }}><Add /></IconButton>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(trustedAIProviders) &&
                            trustedAIProviders.map((provider, index) => {
                                return (
                                    <tr key={index}>
                                        <td><a href={provider?.source}>{provider?.resource}</a></td>
                                        <td>{provider?.description}</td>
                                        <td><Button onClick={() => { handleEditShow(index) }}>Edit</Button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div >
        )
    }
}
