import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';
import '../css/theme.css';

export default function DeleteUserModal(props) {
  const [deleteSubmissions, setDeleteSubmissions] = useState(false);

  return (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header id="contained-modal-title-vcenter">
        <Modal.Title>Delete {props.user?.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <div className="container">
              <div className="row">
                <Form.Label>
                  {' '}
                  Delete all submissions from {props.user?.username}?
                </Form.Label>
                <div className="col text-center">
                  <div key="inline-radio" className="mb-3">
                    <Form.Check
                      inline
                      label="Yes"
                      type="radio"
                      id="inline-radio-1"
                      checked={deleteSubmissions}
                      onChange={() => setDeleteSubmissions(true)}
                    />
                    <Form.Check
                      inline
                      label="No"
                      type="radio"
                      id="inline-radio-2"
                      checked={!deleteSubmissions}
                      onChange={() => setDeleteSubmissions(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.onHide()} id="resetButton">
          Cancel
        </Button>
        <Button
          onClick={() => props.confirmDelete(deleteSubmissions)}
          id="saveButton"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
