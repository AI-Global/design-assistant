import '../css/admin.css';
import api from '../api';
import React, { useEffect, useState } from 'react';
import Add from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import InputGroup from 'react-bootstrap/InputGroup';
import IconButton from '@material-ui/core/IconButton';
import { green, red } from '@material-ui/core/colors';
import { Button, Form, Row, Col, Card } from 'react-bootstrap';

export default function QuestionModal(props) {
  const responseTypes = [
    'text',
    'comment',
    'dropdown',
    'radiogroup',
    'checkbox',
    'slider',
  ];

  // get metadata from props
  const dimensions = props.dimensions;
  const subdimensions = props.subdimensions;
  const domains = props.metadata.domain;
  const lifecycles = props.metadata.lifecycle;
  const regions = props.metadata.region;
  const roles = props.metadata.roles;

  // make copy of responses array so we can revert back to it if needed
  const responsesA = [...props.question.responses];

  // Set all question properties as hooks for rendering and updating
  const [altText, setAltText] = useState(props.question.alt_text);
  const [questionDomain, setDomain] = useState(
    props.question.domainApplicability ? props.question.domainApplicability : []
  );
  const [questionLifecycle, setLifecycle] = useState(
    props.question.lifecycle ? props.question.lifecycle : []
  );
  const [points, setPoints] = useState(props.question.pointsAvailable);
  const [question, setQuestion] = useState(props.question.question);
  const [questionRef, setRef] = useState(props.question.reference);
  const [questionRegion, setRegion] = useState(
    props.question.regionalApplicability
      ? props.question.regionalApplicability
      : []
  );
  const [responseType, setType] = useState(props.question.responseType);
  const [responses, setResponses] = useState(responsesA);
  const [questionRole, setRole] = useState(
    props.question.roles ? props.question.roles : []
  );
  const [dimension, setDimension] = useState(
    props.question.trustIndexDimension
  );
  const [subdimension, setSubDimension] = useState(props.question.subDimension);
  props.question.questionType =
    props.question.questionType[0].toUpperCase() +
    props.question.questionType.substring(1);
  const [weight, setWeight] = useState(props.question.weighting);
  const [questionType, setQType] = useState(props.question.questionType);
  const [questionLink, setLink] = useState(
    props.question?.rec_links?.join(', ')
  );
  const [questionPrompt, setPrompt] = useState(props.question?.prompt);

  // Hook for showing delete quesiton warning
  const [warningShow, setWarningShow] = useState(false);

  // validation for question field
  const [questionValid, setInvalid] = useState(false);
  // validation for slider points fields
  const [sliderLowValid, setSliderLowInvalid] = useState(false);
  const [sliderMedValid, setSliderMedInvalid] = useState(false);
  const [sliderHighValid, setSliderHighInvalid] = useState(false);

  // hook for saving questions so useEffect isn't fired continuously on render
  const [saveQ, setSave] = useState(false);

  const [child, setChild] = useState(props.question.child);
  const [trigger, setTrigger] = useState(props.question.trigger);

  function addResponse(response) {
    // add new response object to responses and rerender response section by spreading the array into a new array
    // problem: https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
    // solution by ray hatfield: https://stackoverflow.com/a/56266640
    response[response.length] = {
      responseNumber: response.length,
      indicator: '',
      score: '',
    };
    setResponses([...response]);
  }

  function removeResponse(index) {
    // remove a response object from the responses array
    const newResponse = responses.filter(function (e) {
      return e.responseNumber !== index;
    });
    for (var i in newResponse) {
      newResponse[i].responseNumber = parseInt(i);
    }
    setResponses(newResponse);
    setResponses([...newResponse]);
  }

  function editIndicator(indicator, index, score) {
    // edit and existing repsonse indicator
    responses[index] = {
      responseNumber: index,
      indicator: indicator,
      score: score,
    };
    setResponses([...responses]);
  }

  function revertIndicators(r) {
    // if the quesiton is closed and edits aren't save we need to loop through all repsonse
    // indicators and reset them to the previous state
    for (var i in r) {
      r[i].responseNumber = parseInt(i);
    }
    setResponses([...r]);
  }

  function editScore(score, index, indicator) {
    // edits the score of an associtaed response indicator
    responses[index] = {
      responseNumber: index,
      indicator: indicator,
      score: score,
    };
    setResponses([...responses]);
  }

  function close() {
    // if modal close button is clicked, edits will not be saved, so revert all values to default
    setAltText(props.question.alt_text);
    setLifecycle(props.question.lifecycle);
    setPoints(props.question.pointsAvailable);
    setQuestion(props.question.question);
    setRef(props.question.reference);
    setType(props.question.responseType);
    setQType(props.question.questionType);
    revertIndicators(props.question.responses);
    setRole(props.question.roles);
    setDimension(props.question.trustIndexDimension);
    setSubDimension(props.question.subDimension);
    setWeight(props.question.weighting);
    setChild(props.question.child);
    setTrigger(props.question.trigger);
    setDomain(props.question.domainApplicability);
    setRegion(props.question.regionalApplicability);
    setLink(props.question.rec_links);
    setPrompt(props.question.prompt);
    setSliderLowInvalid(false);
    setSliderMedInvalid(false);
    setSliderHighInvalid(false);
    setInvalid(false);
    props.onHide();
  }

  function Validate(event) {
    // validates the form: quesiton filed must not be empty and if response type is slider, the low med high fields
    // must be numbers, and ordered low < med< high
    event.preventDefault();
    if (responseType === 'slider') {
      !(
        responses[0]?.score &&
        parseInt(responses[0]?.score) < parseInt(responses[1]?.score) &&
        parseInt(responses[0]?.score) < parseInt(responses[2]?.score)
      )
        ? setSliderLowInvalid(true)
        : setSliderLowInvalid(false);
      !(
        responses[1]?.score &&
        parseInt(responses[1]?.score) < parseInt(responses[2]?.score)
      )
        ? setSliderMedInvalid(true)
        : setSliderMedInvalid(false);
      !responses[2]?.score
        ? setSliderHighInvalid(true)
        : setSliderHighInvalid(false);
    }
    event.target.elements.question.value === ''
      ? setInvalid(true)
      : setInvalid(false);
    // set saveQ hook to true to trigger useEffect and save changes to db
    setSave(true);
  }

  useEffect(() => {
    if (saveQ) {
      save();
    }
  });

  function save() {
    // if form fields are all valid (not invalid), save question to db
    if (
      !questionValid &&
      !sliderLowValid &&
      !sliderMedValid &&
      !sliderHighValid
    ) {
      var endPoint;
      props.question.alt_text = altText;
      props.question.lifecycle = questionLifecycle;
      props.question.pointsAvailable = points;
      props.question.question = question;
      props.question.reference = questionRef;
      props.question.responseType = responseType;
      props.question.questionType = questionType;
      props.question.responses = responses;
      props.question.roles = questionRole;
      props.question.trustIndexDimension = dimension;
      props.question.subDimension = subdimension;
      props.question.weighting = weight;
      props.question.child = child;
      props.question.trigger = trigger;
      props.question.domainApplicability = questionDomain;
      props.question.regionalApplicability = questionRegion;
      props.question.prompt = questionPrompt;
      setSave(false); // important to set saveQ hook back to false so useEffect isn't fired again
      if (questionLink.length) {
        props.question.rec_links = questionLink.split(',');
        for (let i in props.question.rec_links) {
          props.question.rec_links[i] = props.question.rec_links[i]?.trim();
        }
      }
      if (props.mode === 'edit') {
        api
          .put('questions/' + props.question._id, props.question)
          .then((res) => {
            const result = res.data;
            if (result.errors) {
              console.log(result.errors);
            } else {
              console.log('Updated Question: ', result);
            }
          });
        props.onHide();
      } else {
        api.post('questions/', props.question).then((res) => {
          const result = res.data;
          if (result.errors) {
            console.log(result.errors);
          } else {
            console.log('Added Question: ', result);
          }
        });
        // need to clear question metadata before closing for adding action
        props.question.alt_text = null;
        props.question.lifecycle = [];
        props.question.pointsAvailable = 1;
        props.question.question = null;
        props.question.reference = null;
        props.question.responseType = 'text';
        props.question.questionType = 'Risk';
        props.question.responses = [];
        props.question.roles = [];
        props.question.trustIndexDimension = 1;
        props.question.subDimension = null;
        props.question.weighting = 1;
        props.question.child = child;
        props.question.trigger = trigger;
        props.question.domainApplicability = [];
        props.question.regionalApplicability = [];
        props.question.rec_links = [];
        props.question.prompt = null;
        setSave(false); // important to set saveQ hook back to false so useEffect isn't fired again
        close();
      }
    }
  }

  async function deleteQuestion() {
    await api.delete('questions/' + props.question._id).then((res) => {
      const result = res.data;
      if (result.errors) {
        console.log(result.errors);
      } else {
        console.log('Delete Question: ', result);
      }
    });
    setWarningShow(false);
    props.onHide();
  }

  function deleteParent() {
    setTrigger(null);
    setChild(false);
  }

  function updateRole(index) {
    if (questionRole?.includes(index)) {
      const i = questionRole.indexOf(index);
      questionRole.splice(i, 1);
    } else {
      questionRole.push(index);
    }
    setRole([...questionRole]);
  }

  function updateDomain(index) {
    if (questionDomain?.includes(index)) {
      const i = questionDomain.indexOf(index);
      questionDomain.splice(i, 1);
    } else {
      questionDomain.push(index);
    }
    setDomain([...questionDomain]);
  }

  function updateRegion(index) {
    if (questionRegion?.includes(index)) {
      const i = questionRegion.indexOf(index);
      questionRegion.splice(i, 1);
    } else {
      questionRegion.push(index);
    }
    setRegion([...questionRegion]);
  }

  function updateLifecycle(index) {
    if (questionLifecycle?.includes(index)) {
      const i = questionLifecycle.indexOf(index);
      questionLifecycle.splice(i, 1);
    } else {
      questionLifecycle.push(index);
    }
    setLifecycle([...questionLifecycle]);
  }

  function updateDimension(value) {
    setDimension(value);
    // Set weight to zero if tombstone question
    if (value === 1) {
      setWeight(0);
    }
    setQType(questionType);

    setSubDimension(
      Object.values(subdimensions).filter(
        (sdim) => sdim.dimensionID === value
      )[0]?.subDimensionID
    );
  }

  function updateType(type) {
    if (type === 'slider') {
      setResponses([]);
    }
    setType(type);
  }

  if (!dimensions) {
    return null;
  }

  function setSliderPoint(value, s) {
    switch (s) {
      case 'low':
        responses[0] = { responseNumber: 0, indicator: s, score: value };
        setResponses([...responses]);
        break;
      case 'med':
        responses[1] = { responseNumber: 1, indicator: s, score: value };
        setResponses([...responses]);
        break;
      case 'high':
        responses[2] = { responseNumber: 2, indicator: s, score: value };
        setResponses([...responses]);
        break;
      default:
        return;
    }
  }

  return (
    <React.Fragment>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={warningShow}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Warning!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to delete this quesiton?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => deleteQuestion()}>Yes</Button>
          <Button onClick={() => setWarningShow(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-question"
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Question
          </Modal.Title>
          <IconButton size="small" onClick={() => close()} label="Close">
            <CloseIcon />
          </IconButton>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => Validate(e)} noValidate>
            {!child ? null : (
              <Row style={{ paddingBottom: '1em' }}>
                <Col md={12}>
                  <Card
                    style={{
                      padding: '1em',
                      backgroundColor: '#f5f5f5',
                      paddingTop: '0',
                    }}
                  >
                    <Row
                      style={{ alignItems: 'center', paddingBottom: '0.5em' }}
                    >
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => {
                          deleteParent();
                        }}
                      >
                        <DeleteIcon style={{ color: red[500] }} />
                      </IconButton>
                      <div
                        style={{
                          fontSize: '12px',
                          fontStyle: 'italic',
                          position: 'relative',
                        }}
                      >
                        Parent
                      </div>
                    </Row>
                    {props.question.trigger.parentQuestion}
                  </Card>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={4} md={3}>
                <Form.Group controlId="questionDimension">
                  <Form.Label>Dimension</Form.Label>
                  <Form.Control
                    value={dimension === null ? '' : dimension}
                    as="select"
                    onChange={(event) =>
                      updateDimension(parseInt(event.target.value))
                    }
                  >
                    {Object.values(dimensions).map((dimension, index) => (
                      <option
                        key={index + 1}
                        value={index + 1}
                        data-testid={dimension.name}
                      >
                        {dimension.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              {dimension === 1 ? null : (
                <Col xs={4} md={3}>
                  <Form.Group controlId="questionSubDimension">
                    <Form.Label>Sub-Dimension</Form.Label>
                    <Form.Control
                      value={subdimension === null ? '' : subdimension}
                      as="select"
                      onChange={(event) =>
                        setSubDimension(parseInt(event.target.value))
                      }
                    >
                      {Object.values(subdimensions)
                        .filter((sdim) => sdim.dimensionID === dimension)
                        .map((subdimension, index) => (
                          <option
                            key={subdimension.subDimensionID}
                            value={subdimension.subDimensionID}
                            data-testid={subdimension.name}
                          >
                            {subdimension.name}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              )}

              <Col xs={4} md={2}>
                <Form.Group controlId="responseType">
                  <Form.Label>Response Type</Form.Label>
                  <Form.Control
                    data-testid="responseType"
                    value={responseType || ''}
                    as="select"
                    onChange={(event) => updateType(event.target.value)}
                  >
                    {responseTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              {/*Dimension 1 is always tombstone and dimension 2 is always organization*/}
              {dimension === 1 || dimension === 2 ? null : (
                <Col xs={4} md={2}>
                  <Form.Label>Question Type</Form.Label>
                  <Form.Control
                    value={questionType}
                    as="select"
                    onChange={(event) => setQType(event.target.value)}
                  >
                    <option>Risk</option>
                    <option>Mitigation</option>
                  </Form.Control>
                </Col>
              )}
              {responseType === 'dropdown' ||
                responseType === 'radiogroup' ||
                responseType === 'checkbox' ||
                responseType === 'slider' ? (
                <React.Fragment>
                  {/* Remove weighting as it's currently not used in scoring 
                  <Col xs={4} md={2}>
                    <Form.Label>Weight</Form.Label>
                    <Form.Control
                      value={weight}
                      as="select"
                      onChange={(event) => setWeight(event.target.value)}
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </Form.Control>
                  </Col>*/}

                  {responseType === 'slider' ? (
                    <React.Fragment>
                      <Col xs={1} md={1}>
                        <Form.Label>Low</Form.Label>
                        <Form.Control
                          className="slider-points"
                          required="required"
                          isInvalid={sliderLowValid}
                          value={
                            responses[0]?.score === 0
                              ? 0
                              : responses[0]?.score ?? ''
                          }
                          type="number"
                          onChange={(event) =>
                            setSliderPoint(event.target.value, 'low')
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid
                        </Form.Control.Feedback>
                      </Col>
                      <Col xs={1} md={1}>
                        <Form.Label>Med</Form.Label>
                        <Form.Control
                          className="slider-points"
                          required="required"
                          isInvalid={sliderMedValid}
                          value={
                            responses[1]?.score === 0
                              ? 0
                              : responses[1]?.score ?? ''
                          }
                          type="number"
                          onChange={(event) =>
                            setSliderPoint(event.target.value, 'med')
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid
                        </Form.Control.Feedback>
                      </Col>
                      <Col xs={1} md={1}>
                        <Form.Label>High</Form.Label>
                        <Form.Control
                          className="slider-points"
                          required="required"
                          isInvalid={sliderHighValid}
                          value={
                            responses[2]?.score === 0
                              ? 0
                              : responses[2]?.score ?? ''
                          }
                          type="number"
                          onChange={(event) =>
                            setSliderPoint(event.target.value, 'high')
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid
                        </Form.Control.Feedback>
                      </Col>
                    </React.Fragment>
                  ) : null}
                </React.Fragment>
              ) : null}
            </Row>
            <Row>
              <Col xs={12} md={12}>
                <Form.Group controlId="question">
                  <Form.Label>Question</Form.Label>
                  <Form.Control
                    data-testid="question"
                    required="required"
                    isInvalid={questionValid}
                    as="textarea"
                    placeholder="Question"
                    value={question || ''}
                    onChange={(event) => setQuestion(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a question
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            {responseType === 'checkbox' ? (
              <Row>
                <Col xs={12} md={12}>
                  <Form.Group controlId="prompt">
                    <Form.Label>Prompt</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="Question Prompt"
                      value={questionPrompt || ''}
                      onChange={(event) => setPrompt(event.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ) : null}
            {responseType === 'comment' ||
              responseType === 'text' ||
              responseType === 'slider' ? null : (
              <Row>
                <Col xs={10} md={10} style={{ display: 'inline-block' }}>
                  <Form.Group>
                    <Form.Label>
                      Responses
                      <IconButton
                        aria-label="add response"
                        size="small"
                        style={{ marginLeft: '0.3em' }}
                        onClick={() => {
                          addResponse(responses);
                        }}
                      >
                        <Add style={{ color: green[500] }} />
                      </IconButton>
                    </Form.Label>
                    {responses.map((response, index) => (
                      <div key={index} style={{ paddingBottom: '0.5em' }}>
                        <InputGroup
                          className="mb-2"
                          style={{ minHeight: '44px' }}
                        >
                          <InputGroup.Prepend>
                            <InputGroup.Text>
                              <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => {
                                  removeResponse(index);
                                }}
                              >
                                <DeleteIcon
                                  key={index}
                                  style={{ color: red[500] }}
                                />
                              </IconButton>
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            id={'response-' + index}
                            type="text"
                            placeholder="Response"
                            value={response.indicator}
                            style={{ height: 'inherit' }}
                            onChange={(event) =>
                              editIndicator(
                                event.target.value,
                                index,
                                response.score
                              )
                            }
                          />
                        </InputGroup>
                      </div>
                    ))}
                  </Form.Group>
                </Col>
                <Col xs={2} md={2}>
                  <Form.Group>
                    <Form.Label style={{ paddingBottom: '4px' }}>
                      {' '}
                      {/*  */}
                      Score
                    </Form.Label>
                    {responses.map((response, index) => (
                      <div key={index} style={{ paddingBottom: '1em' }}>
                        <Form.Control
                          id={'response-score-' + index}
                          type="text"
                          placeholder="0"
                          value={response.score}
                          style={{ minHeight: '44px' }}
                          onChange={(event) =>
                            editScore(
                              event.target.value,
                              index,
                              response.indicator
                            )
                          }></Form.Control>
                      </div>
                    ))}
                  </Form.Group>
                </Col>
              </Row>
            )}
            {
              <Row>
                <Col xs={2} md={3}>
                  <Form.Group controlId="roles">
                    <Form.Label>Role</Form.Label>
                    <Card className="select-list-box">
                      {roles?.map((role, index) => (
                        <Form.Check
                          type="checkbox"
                          checked={questionRole?.includes(index + 1)}
                          label={role.name}
                          id={'role' + role.name}
                          key={index}
                          value={index + 1}
                          onChange={(e) => updateRole(parseInt(e.target.value))}
                        />
                      ))}
                    </Card>
                  </Form.Group>
                </Col>
                <Col xs={2} md={3}>
                  <Form.Group controlId="domains">
                    <Form.Label>Domain</Form.Label>
                    <Card className="select-list-box">
                      {domains?.map((domain, index) => (
                        <Form.Check
                          type="checkbox"
                          checked={questionDomain?.includes(index + 1)}
                          label={domain.name}
                          id={'domain-' + domain.name}
                          key={index}
                          value={index + 1}
                          onChange={(e) =>
                            updateDomain(parseInt(e.target.value))
                          }
                        />
                      ))}
                    </Card>
                  </Form.Group>
                </Col>
                <Col xs={2} md={3}>
                  <Form.Group controlId="regions">
                    <Form.Label>Region</Form.Label>
                    <Card className="select-list-box">
                      {regions?.map((region, index) => (
                        <Form.Check
                          type="checkbox"
                          checked={questionRegion?.includes(index + 1)}
                          label={region.name}
                          id={'region-' + region.name}
                          key={index}
                          value={index + 1}
                          onChange={(e) =>
                            updateRegion(parseInt(e.target.value))
                          }
                        />
                      ))}
                    </Card>
                  </Form.Group>
                </Col>
                <Col xs={2} md={3}>
                  <Form.Group controlId="lifecycles">
                    <Form.Label>Life-Cycle</Form.Label>
                    <Card className="select-list-box">
                      {lifecycles?.map((lifecycle, index) => (
                        <Form.Check
                          type="checkbox"
                          checked={questionLifecycle?.includes(index + 1)}
                          label={lifecycle.name}
                          id={'lifecycle-' + lifecycle.name}
                          key={index}
                          value={index + 1}
                          onChange={(e) =>
                            updateLifecycle(parseInt(e.target.value))
                          }
                        />
                      ))}
                    </Card>
                  </Form.Group>
                </Col>
              </Row>
            }
            <Row>
              <Col xs={12} md={12}>
                <Form.Group controlId="altText">
                  <Form.Label>Alt Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Alt text"
                    value={altText || ''}
                    onChange={(event) => setAltText(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            {
              <React.Fragment>
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group controlId="Reference">
                      <Form.Label>Reference</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Reference"
                        value={questionRef || ''}
                        onChange={(event) => setRef(event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group controlId="Link">
                      <Form.Label>Link</Form.Label>
                      <Form.Control
                        placeholder="Link"
                        value={questionLink || ''}
                        onChange={(event) => setLink(event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </React.Fragment>
            }
            <div id="modal-footer-border" />
            <div id="modal-footer" alt_text="footer">
              <Button id="resetButton" onClick={() => setWarningShow(true)}>
                Delete
              </Button>
              <Button id="saveButton" type="submit" label="save">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
