import api from '../api';
import React, { Component } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';

export default class Dimensions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: [],
      showEditModal: false,
      currentIndex: undefined,
      showDeleteWarning: false,
      source: {},
    };
  }

  // retrieves the list of trusted ai dimensions that can be edited
  componentDidMount() {
    api
      .get('dimensions')
      .then((res) => {
        this.setState({ dimensions: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // upon confirmation of delete, sends the id of the trusted ai dimensions to backend to be deleted
  deleteDimension() {
    let dimensions = this.state.dimensions;
    let currentIndex = this.state.currentIndex;
    if (currentIndex !== -1) {
      api
        .delete('dimensions/' + dimensions[currentIndex]?._id)
        .then((response) => {
          dimensions.splice(currentIndex, 1);
          this.setState({ dimensions: dimensions });
        });
    }
    this.setState({ showDeleteWarning: false });
    this.setState({ showEditModal: false });
  }

  /**
   *  upon submission of the form, sends updated/new trusted ai dimension to backend to
   *  be validated and saved in DB then updates the list of trusted ai dimensions for admin view
   */
  saveDimension(event) {
    event.preventDefault();
    let form = event.target.elements;
    let dimensions = this.state.dimensions;
    let currentIndex = this.state.currentIndex;
    let body = {
      name: form.name.value,
      description: form.description.value,
      dimensionID: form.dimensionID.value,
      weight: form.weight.value,
    };
    api
      .put(
        'dimensions/' + (dimensions[currentIndex]?._id ?? ''),
        body
      )
      .then((response) => {
        let newDimensions = response.data;
        if (dimensions[currentIndex]?._id) {
          dimensions[currentIndex] = newDimensions;
        } else {
          dimensions.unshift(newDimensions);
        }
        this.setState({ dimensions: dimensions });
        this.setState({ showEditModal: false });
      })
      .catch((err) => {
        this.setState(err.response.data);
      });
  }

  createDimension(event) {
    event.preventDefault();
    let form = event.target.elements;
    let dimensions = this.state.dimensions;
    let currentIndex = this.state.currentIndex;
    let body = {
      name: form.name.value,
      description: form.description.value,
      dimensionID: form.dimensionID.value,
      weight: form.weight.value,
    };
    api
      .post(
        'dimensions/',
        body
      )
      .then((response) => {
        let newDimensions = response.data;
        if (dimensions[currentIndex]?._id) {
          dimensions[currentIndex] = newDimensions;
        } else {
          dimensions.unshift(newDimensions);
        }
        this.setState({ dimensions: dimensions });
        this.setState({ showEditModal: false });
      })
      .catch((err) => {
        this.setState(err.response.data);
      });
  }

  render() {
    var dimensions = this.state.dimensions;
    var currentIndex = this.state.currentIndex;
    const showEdit = this.state.showEditModal;
    const handleClose = () => this.setState({ showDeleteWarning: false });
    const handleEditClose = () => this.setState({ showEditModal: false });
    const handleEditShow = (index) =>
      this.setState({ showEditModal: true, currentIndex: index, source: {} });
    return (
      <div>
        <Modal
          centered
          show={this.state.showDeleteWarning}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-name-vcenter">
              Warning!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you would like to delete this Dimension?
          </Modal.Body>
          <Modal.Footer>
            <Button
              id="DeleteSurveyButton"
              onClick={() => this.deleteDimension()}
            >
              Yes
            </Button>
            <Button onClick={() => handleClose()}>Cancel</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showEdit}
          centered
          size="lg"
          onHide={handleEditClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Dimension</Modal.Title>
          </Modal.Header>
          <Form onSubmit={(e) => dimensions[currentIndex]?._id ? this.saveDimension(e) : this.createDimension(e)}>
            <Modal.Body className="p-4">
              <Form.Group controlId="name">
                <Form.Label className="edit-trusted-form-label">
                  Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  required="required"
                  autoComplete="text"
                  aria-label="Name"
                  defaultValue={dimensions[currentIndex]?.name}
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label className="edit-trusted-form-label">
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Description"
                  autoComplete="text"
                  aria-label="Description"
                  defaultValue={dimensions[currentIndex]?.description}
                />
              </Form.Group>
              <Form.Group controlId="dimensionID">
                <Form.Label className="edit-trusted-form-label">
                  Dimension ID
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Dimension ID"
                  required="required"
                  autoComplete="text"
                  isInvalid={this.state.source?.isInvalid}
                  aria-label="DimensionID"
                  defaultValue={dimensions[currentIndex]?.dimensionID}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.source?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="weight">
                <Form.Label className="edit-trusted-form-label">
                  Weight
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Weight"
                  autoComplete="text"
                  aria-label="Weight"
                  defaultValue={dimensions[currentIndex]?.weight || 0.5}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Col md={9} className="mr-4">
                <Button
                  id="resetButton"
                  onClick={() => {
                    this.setState({ showDeleteWarning: true });
                  }}
                >
                  {' '}
                  Delete
                </Button>
              </Col>
              <Col md={2}>
                <Button id="saveButton" type="submit" label="save">
                  Save
                </Button>
              </Col>
            </Modal.Footer>
          </Form>
        </Modal>
        <br />
        <Table className="mt-3">
          <TableHead>
            <TableRow className="edit-trusted-headers">
              <TableCell width="33%" style={{ textAlign: 'center' }}>Dimension</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Description</TableCell>
              <TableCell className="text-center">
                <IconButton
                  aria-label="add dimensions"
                  size="small"
                  onClick={() => {
                    handleEditShow(-1);
                  }}
                >
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(dimensions) &&
              dimensions.map((dimension, index) => {
                return (
                  <TableRow hover={true} key={index}>
                    <TableCell>
                      <a href={dimension?.name}>{dimension?.name}</a>
                    </TableCell>
                    <TableCell>{dimension?.description}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          handleEditShow(index);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
