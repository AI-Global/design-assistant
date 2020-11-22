import axios from 'axios';
import React, { Component } from 'react';
import {Table, Button, Modal, Form, Col} from 'react-bootstrap';

export default class AdminProviders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trustedAIProviders: [],
            showEditModal: false,
            currentTrustedAIProvider: undefined
        }
    }
    componentDidMount(){
        let endPoint = '/trustedAIProviders'
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint).then(res => {
            this.setState({trustedAIProviders: res.data});
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        var trustedAIProviders = this.state.trustedAIProviders;
        const showEdit = this.state.showEditModal;
        const handleEditClose = () => this.setState({showEditModal: false});
        const handleEditShow = (provider) => this.setState({showEditModal: true, currentTrustedAIProvider: provider});
        return (
            <div>
                <Modal show={showEdit}
                size="lg"
                onHide={handleEditClose}
                backdrop="static"
                keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Trusted AI Provider
                        </Modal.Title>
                    </Modal.Header>        
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                {console.log(this.state.currentTrustedAIProvider)}
                                <Form.Control type="text" placeholder="Title" required="required" autoComplete="text" isInvalid={false} aria-label="Title" value={this.state.currentTrustedAIProvider?.resource}/>
                                <Form.Control.Feedback type="invalid">
                                    {}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" placeholder="Description" autoComplete="text" isInvalid={false} aria-label="Description" value={this.state.currentTrustedAIProvider?.description} />
                                <Form.Control.Feedback type="invalid">
                                    {}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="source">
                                <Form.Label>Source</Form.Label>
                                <Form.Control type="text" placeholder="Source" required="required" autoComplete="text" isInvalid={false} aria-label="Source" value={this.state.currentTrustedAIProvider?.source}/>
                                <Form.Control.Feedback type="invalid">
                                    {}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    </Modal.Body>        
                    <Modal.Footer>
                        <Button id="resetButton"> Delete</Button>
                        <Button id="saveButton" type="submit" label="save">Save</Button>
                    </Modal.Footer>
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
                        {trustedAIProviders.map(provider => {
                            return (
                                <tr>
                                    <td><a href={provider?.source}>{provider?.resource}</a></td>
                                    <td>{provider?.description}</td>
                                    <td><Button onClick={() => {handleEditShow(provider)}}>Edit</Button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}
