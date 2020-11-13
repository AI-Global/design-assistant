import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import '../css/theme.css';


export default function ChildModal(props) {
    // console.log(numResponse)

    var currentQuestion = (props.current_question) ? props.current_question.question : "0";
    var previousQuestion = (props.previous_question) ? props.previous_question.question : "0";

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="modal-30w"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Make "{currentQuestion}" a child question of "{previousQuestion}"?
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button onClick={props.onHide} id="resetButton">No</Button>
                <Button onClick={props.clickYes} id="saveButton">Yes</Button>
            </Modal.Footer>
        </Modal>
    );
}