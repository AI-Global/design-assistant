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

export default class SubDimensions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: [],
      subDimensions: [],
      showEditModal: false,
      currentIndex: undefined,
      showDeleteWarning: false,
      source: {},
    };
  }

  // retrieves the list of subDimensions that can be edited
  componentDidMount() {
    api
      .get('subdimensions')
      .then((res) => {
        this.setState({ subDimensions: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .get('dimensions')
      .then((res) => {
        this.setState({ dimensions: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // upon confirmation of delete, sends the id of the subDimensions to backend to be deleted
  deleteSubDimension() {
    let subDimensions = this.state.subDimensions;
    let currentIndex = this.state.currentIndex;
    if (currentIndex !== -1) {
      api
        .delete('subdimensions/' + subDimensions[currentIndex]?._id)
        .then((response) => {
          subDimensions.splice(currentIndex, 1);
          this.setState({ subDimensions: subDimensions });
        });
    }
    this.setState({ showDeleteWarning: false });
    this.setState({ showEditModal: false });
  }

  /**
   *  upon submission of the form, sends updated/new subDimension to backend to
   *  be validated and saved in DB then updates the list of trusted ai subDimensions for admin view
   */
  saveSubDimension(event) {
    event.preventDefault();
    let form = event.target.elements;
    let subDimensions = this.state.subDimensions;
    let currentIndex = this.state.currentIndex;
    let body = {
      name: form.name.value,
      description: form.description.value,
      dimensionID: form.dimensionID.value,
    };
    api
      .put(
        'subdimensions/' + (subDimensions[currentIndex]?._id ?? ''),
        body
      )
      .then((response) => {
        let newSubDimensions = response.data;
        if (subDimensions[currentIndex]?._id) {
          subDimensions[currentIndex] = newSubDimensions;
        } else {
          subDimensions.unshift(newSubDimensions);
        }
        this.setState({ subDimensions: subDimensions });
        this.setState({ showEditModal: false });
      })
      .catch((err) => {
        this.setState(err.response.data);
      });
  }

  render() {
    var dimensions = this.state.dimensions;
    var subDimensions = this.state.subDimensions;
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
            Are you sure you would like to delete this Sub-Dimension?
          </Modal.Body>
          <Modal.Footer>
            <Button
              id="DeleteSurveyButton"
              onClick={() => this.deleteProvider()}
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
            <Modal.Title>Sub-Dimension</Modal.Title>
          </Modal.Header>
          <Form onSubmit={(e) => this.saveSubDimension(e)}>
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
                  defaultValue={subDimensions[currentIndex]?.name}
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
                  defaultValue={subDimensions[currentIndex]?.description}
                />
              </Form.Group>
              <Form.Group controlId="dimensionID">
                <Form.Label className="edit-trusted-form-label">
                  Dimension ID
                </Form.Label>
                <Form.Control as="select" required="required">
                  {dimensions.map((option) => (
                    <option
                      selected={option.dimensionID === subDimensions[currentIndex]?.dimensionID}
                      key={option.dimensionID}
                      value={option.dimensionID}
                    >
                      {option.name}
                    </option>
                  ))}
                </Form.Control>
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
              <TableCell width="33%" style={{ textAlign: 'center' }}>Sub-Dimension</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Description</TableCell>
              <TableCell className="text-center">
                <IconButton
                  aria-label="add provider"
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
            {Array.isArray(subDimensions) &&
              subDimensions.map((subDimension, index) => {
                return (
                  <TableRow hover={true} key={index}>
                    <TableCell>
                      <a href={subDimension?.name}>{subDimension?.name}</a>
                    </TableCell>
                    <TableCell>{subDimension?.description}</TableCell>
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
