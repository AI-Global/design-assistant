import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import api from '../api';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import '../css/admin.css';

export default function FileModal(props) {
  const [questionsFile, setQuestionsFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const fileReader = new FileReader();
  const dimensions = props.dimensions;
  const subdimensions = props.subdimensions;
  const allQuestions = props.questions;
  let qNumToId = {};
  //map questionNumber to _id for easy access (for parent-child editing)
  for (var i = 0; i < allQuestions.length; i++) {
    let question = allQuestions[i];
    qNumToId[question['questionNumber']] = question['_id'];
  }
  //close modal
  function close() {
    props.onHide();
  }

  //add a question
  //questionRows: a list for one question. The first element has all the information about a quesiton
  //the remaining elements holds the data for multiple responses, multiple trigger responses, or multiple
  //rec_links
  let createQuestion = (questionRows, numToIdMap) => {
    let rowData = questionRows[0];
    let currentQ = {};
    currentQ.__v = 0;
    currentQ.alt_text = rowData[13];
    currentQ.domainApplicability = [];
    currentQ.lifecycle = [];
    currentQ.mandatory = true;
    currentQ.parent = null;
    currentQ.pointsAvailable = 1;
    currentQ.prompt = null;
    currentQ.question = rowData[1];
    currentQ.questionNumber = rowData[0];
    currentQ.questionType = rowData[4];
    currentQ.reference = rowData[12];
    currentQ.regionalApplicability = [];
    currentQ.responseType = rowData[8];
    currentQ.roles = [];
    currentQ.weighting = 1;

    //handle parent-child
    let parentQNum = rowData[6];
    if (parentQNum == '') {
      currentQ.child = false;
      currentQ.trigger = { responses: [] };
    } else {
      let parentQID = numToIdMap[parseInt(parentQNum)];
      let parentQuestion = Object.values(allQuestions).filter(
        (q) => q._id === parentQID
      )[0];
      currentQ.child = true;
      currentQ.trigger = {
        parent: parentQID,
        parentQuestion: parentQuestion['question'],
      };
      let triggerResponseIds = [];
      console.log('q', questionRows);
      for (var i = 0; i < questionRows.length; i++) {
        let triggerResponse = questionRows[i][7];
        if (triggerResponse != '') {
          let responseObj = Object.values(parentQuestion['responses']).filter(
            (response) => response.indicator === triggerResponse
          )[0];
          triggerResponseIds.push(responseObj._id);
        }
      }
      currentQ.trigger['responses'] = triggerResponseIds;
    }

    //set the dimension index
    let dimension = Object.values(dimensions).filter(
      (sdim) => sdim.name === rowData[2]
    );
    currentQ.trustIndexDimension = dimension[0].dimensionID;

    if (dimension[0].dimensionID != 1) {
      let subdimension = Object.values(subdimensions).filter(
        (sdim) => sdim.name === rowData[3]
      );
      currentQ.subDimension = subdimension[0].subDimensionID;
    }
    let responses = [];
    let recLinks = [];
    for (var i = 0; i < questionRows.length; i++) {
      let rowI = questionRows[i];
      let r = {};
      r['responseNumber'] = i;
      if (rowI[9] != '') {
        r['indicator'] = rowI[9];
        r['score'] = parseFloat(rowI[10]);
        responses.push(r);
      }
      if (rowI[14] != '' && rowI[14] != null) {
        recLinks.push(rowI[14]);
      }
    }
    currentQ.responses = responses;
    currentQ.rec_links = recLinks;
    return currentQ;
  };

  //add all the questions from .tsv file
  let onFileUpload = async () => {
    if (questionsFile == null || fileName.split('.').slice(-1)[0] != 'tsv') {
      return;
    }
    if (!loadingQuestions) {
      setLoadingQuestions(true);
    }
    let questions = questionsFile.split('\r\n');
    let fields = questions[0];
    for (var i = 1; i < questions.length; i++) {
      let rowData = questions[i].split('\t');
      if (rowData[0] != '') {
        let rowsForQuestion = [];
        rowsForQuestion.push(rowData);
        let localI = i + 1;
        while (localI < questions.length && questions[localI][0] == '\t') {
          rowsForQuestion.push(questions[localI].split('\t'));
          localI += 1;
        }
        let q = createQuestion(rowsForQuestion, qNumToId);
        await api.post('questions/', q).then((res) => {
          const result = res.data;
          if (result.errors) {
            console.log(result.errors);
          } else {
            console.log('Added Question: ', result);
            qNumToId[result['questionNumber']] = result['_id'];
            allQuestions.push(result);
          }
        });
      }
    }
    setLoadingQuestions(false);
    // window.location.reload(false);
  };

  //delete all questions and then add questions from .tsv
  let deleteAndUpload = async () => {
    if (questionsFile == null || fileName.split('.').slice(-1)[0] != 'tsv') {
      return;
    }
    setLoadingQuestions(true);
    for (var i = 0; i < allQuestions.length; i++) {
      let qID = allQuestions[i]['_id'];
      await api.delete('questions/' + qID).then((res) => {
        const result = res.data;
        if (result.errors) {
          console.log(result.errors);
        } else {
          console.log('Delete Question: ', result);
        }
      });
    }
    onFileUpload();
  };

  let onFileChange = (event) => {
    const reader = new FileReader();
    reader.addEventListener('load', (eventData) => {
      setQuestionsFile(eventData.target.result);
    });
    reader.readAsText(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const hiddenFileInput = React.useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  return (
    <React.Fragment>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Upload Questions
          </Modal.Title>
          <IconButton size="small" onClick={() => close()} label="Close">
            <CloseIcon />
          </IconButton>
        </Modal.Header>
        {!loadingQuestions && (
          <>
            <Modal.Body>
              <p>
                Upload a .tsv file to batch add questions (add more questions OR
                delete all current questions and add questions from .tsv file).
              </p>
              <div>
                <Button onClick={handleClick}>Browse</Button>
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={onFileChange}
                  style={{ display: 'none' }}
                ></input>
                {fileName ? ' ' + fileName : ' No file uploaded'}
              </div>
            </Modal.Body>
            <Modal.Body>
              <div style={{ paddingBottom: '10px' }}>
                <Button onClick={onFileUpload}>Add more questions</Button>
              </div>
              <div>
                <Button onClick={deleteAndUpload}>
                  Delete all & add questions
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
        {loadingQuestions && (<Modal.Body>  <Spinner animation="border" variant="secondary" /></Modal.Body>)}
      </Modal>
    </React.Fragment>
  );
}
