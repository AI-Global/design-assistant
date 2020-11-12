import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import '../css/theme.css';


export default function ChildModal(props) {
    // console.log(numResponse)

    var currentQuestion = (props.current_question) ? props.current_question.question : "0";
    var previousQuestion = (props.previous_question) ? props.previous_question.question : "0";
    var responses = (props.previous_question && props.previous_question) ? props.previous_question.responses : [];

    const [makeChild, setMakeChild] = useState(false);
    const [checkedBoxes, setCheckedBoxes] = useState({})

    function close() {
        // reset the state
        setMakeChild(false);
        setCheckedBoxes({});
        props.onHide();
    }

    function save() {
        // saves the parent child relationship
        if (setMakeChild) {
            props.current_question.child = true;
            var parentNumber = props.previous_question.questionNumber;
            var triggers = [];
            for (const [key, val] of Object.entries(checkedBoxes)) {
                if (val) {
                    triggers.push(key);
                }
            }
            props.current_question.trigger = { parentNumber, triggers };

            var endPoint = '/questions/' + props.current_question._id;
            axios.put(process.env.REACT_APP_SERVER_ADDR + endPoint, props.current_question)
                .then(res => {
                    const result = res.data;
                    if (result.errors) {
                        console.log(result.errors);
                    }
                    else {
                        console.log("Updated Question: ", result)
                    }
                })
            setMakeChild(false);
            setCheckedBoxes({});
            props.clickYes();
        } else{
            close();
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="modal-30w"
        >
            <Modal.Header>

                <Form>
                    <Row>
                        <Col md={{ span: 4, offset: 10 }}>
                            <IconButton size="small" onClick={() => close()} label="Close">
                                <CloseIcon />
                            </IconButton>
                        </Col>
                    </Row>
                    <Form.Group controlId="makeChild">
                        <Row>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Make "{currentQuestion}" a child question of "{previousQuestion}"?
                    </Modal.Title>
                        </Row>
                        <Col sm="12" md={{ size: 6, offset: 5 }}>
                            <Row>
                                <div key='inline-radio' className="mb-3">
                                    <Form.Check inline label="Yes" type='radio' checked={makeChild} id='inline-radio-1' onChange={() => setMakeChild(true)} />
                                    <Form.Check inline label="No" type='radio' checked={!makeChild} id='inline-radio-2' onChange={() => setMakeChild(false)} />
                                </div>
                            </Row>
                        </Col>
                    </Form.Group>
                    {!makeChild ? null :
                        <Form.Group>
                            <Row>
                                <div key='responses-list' className='mb-3'>
                                    {responses.map((response, index) =>
                                        <Form.Check type="checkbox" id={response.responseNumber} label={response.indicator} checked={checkedBoxes[response.responseNumber]}
                                            onChange={() => {
                                                let temp = checkedBoxes;
                                                temp[response.responseNumber] = !checkedBoxes[response.responseNumber];
                                                setCheckedBoxes(temp);
                                            }} />
                                    )
                                    }
                                </div>
                            </Row>
                        </Form.Group>
                    }
                </Form>
            </Modal.Header>
            <Modal.Footer>
                <Button onClick={() => close()} id="resetButton">Cancel</Button>
                <Button onClick={() => save()} id="saveButton">Confirm Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}