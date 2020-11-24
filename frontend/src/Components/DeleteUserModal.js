import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, Card } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import '../css/theme.css';


export default function DeleteUserModal(props) {
    const user = props.user;
    const [deleteSubmissions, setDeleteSubmissions] = useState(false);

    return (
        <Modal
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={props.show}
            onHide={props.onHide}>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <div class="container">
                            <div class="row">
                                <div class="col text-center">
                                <Form.Label> Delete {props.user?.username}'s Submissions?</Form.Label>
                                    <div key='inline-radio' className="mb-3" style={{ paddingTop: "1.5em" }}>
                                        <Form.Check inline label="Yes" type='radio' id='inline-radio-1' checked={deleteSubmissions} onChange={() => setDeleteSubmissions(true)} />
                                        <Form.Check inline label="No" type='radio' id='inline-radio-2' checked={!deleteSubmissions} onChange={() => setDeleteSubmissions(false)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.onHide()} id="resetButton">Cancel</Button>
                <Button onClick={() => props.confirmDelete(deleteSubmissions)} id="saveButton">Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}