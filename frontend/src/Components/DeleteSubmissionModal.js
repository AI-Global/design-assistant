import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, Card } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import '../css/theme.css';


export default function DeleteUserModal(props) {
    const submission = props.submission;

    return (
        <Modal
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={props.show}
            onHide={props.onHide}>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Are you sure you would like to delete {submission?.username}'s submission?
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
            <Button onClick={() => props.onHide()} id="resetButton">Cancel</Button>
                <Button onClick={() => props.confirmDelete()} id="saveButton">Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}