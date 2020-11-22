import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col } from 'react-bootstrap';

export default class AdminProviders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trustedAIProviders: [],
            showEditModal: false,
            currentIndex: undefined,
            showDeleteWarning: false
        }
    }

    componentDidMount() {
        let endPoint = '/trustedAIProviders'
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint).then(res => {
            this.setState({ trustedAIProviders: res.data });
        }).catch(err => {
            console.log(err);
        })
    }

    deleteProvider() {
        let trustedAIProviders = this.state.trustedAIProviders;
        let currentIndex = this.state.currentIndex;
        let endPoint = "/trustedAIProviders/" + trustedAIProviders[currentIndex]?._id;
        axios.delete(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(response => {
                trustedAIProviders.splice(currentIndex, 1);
                this.setState({ trustedAIProviders: trustedAIProviders });
            });
        this.setState({ showDeleteWarning: false })
        this.setState({ showEditModal: false });
    }

    saveProvider(event) {
        event.preventDefault();
        let form = event.target.elements;
        let trustedAIProviders = this.state.trustedAIProviders;
        let currentIndex = this.state.currentIndex;
        let endPoint = "/trustedAIProviders/" + trustedAIProviders[currentIndex]?._id;
        let body = {
            resource: form.title.value,
            description: form.description.value,
            source: form.source.value
        };
        axios.put(process.env.REACT_APP_SERVER_ADDR + endPoint, body)
            .then(response => {
                let newProvider = response.data;
                if(trustedAIProviders[currentIndex]?._id){
                    trustedAIProviders[currentIndex] = newProvider;
                }
                else{
                    trustedAIProviders.unshift(newProvider);
                }
                this.setState({ trustedAIProviders: trustedAIProviders });
            });
        this.setState({ showEditModal: false });
    }

    render(){
                var trustedAIProviders = this.state.trustedAIProviders;
                var currentIndex = this.state.currentIndex;
                const showEdit = this.state.showEditModal;
                const handleClose = () => this.setState({ showDeleteWarning: false });
                const handleEditClose = () => this.setState({ showEditModal: false });
                const handleEditShow = (index) => this.setState({ showEditModal: true, currentIndex: index });
                return(
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
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" placeholder="Title" required="required" autoComplete="text" isInvalid={false} aria-label="Title" defaultValue={trustedAIProviders[currentIndex]?.resource}/>
                                    <Form.Control.Feedback type="invalid">
                                        {}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Description" autoComplete="text" isInvalid={false} aria-label="Description" defaultValue={trustedAIProviders[currentIndex]?.description} />
                                    <Form.Control.Feedback type="invalid">
                                        {}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="source">
                                    <Form.Label>Source</Form.Label>
                                    <Form.Control type="text" placeholder="Source" required="required" autoComplete="text" isInvalid={false} aria-label="Source" defaultValue={trustedAIProviders[currentIndex]?.source}/>
                                    <Form.Control.Feedback type="invalid">
                                        {}
                                    </Form.Control.Feedback>
                                </Form.Group>
                        </Modal.Body>        
                        <Modal.Footer>
                                <Col md={9} className="mr-4">
                                    <Button id="resetButton" onClick={() => {this.setState({showDeleteWarning: true})}}> Delete</Button>
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
                            <th width="33%">Trusted AI Provider</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {trustedAIProviders.map((provider, index) => {
                            return (
                                <tr key={index}>
                                    <td><a href={provider?.source}>{provider?.resource}</a></td>
                                    <td>{provider?.description}</td>
                                    <td><Button onClick={() => {handleEditShow(index)}}>Edit</Button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div >
        )
    }
}
