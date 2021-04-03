import ReactDOM from 'react-dom';
import React, { Component, useState, useEffect } from 'react';
import { DropdownButton, Dropdown, Button, Modal } from 'react-bootstrap';
import api from '../api';
import Files from 'react-files';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export default function FileModal(props) {
  let [questionsFile, setQuestionsFile] = useState([]);
  let fileReader = new FileReader();
  const dimensions = props.dimensions;
  const subdimensions = props.subdimensions;
  let all_questions = props.questions;
  var q_num_to_id = {}
  for (var i = 0; i < all_questions.length; i++) {
    let question = all_questions[i]
    q_num_to_id[question['questionNumber']] = question['_id'];
  }

  let createQuestion = (question_rows, num_to_id_map) => {
    let row_data = question_rows[0];
    let current_q = {};
    current_q.__v = 0;
    current_q.alt_text = row_data[13];
    current_q.domainApplicability = [];
    current_q.lifecycle = [];
    current_q.mandatory = true;
    current_q.parent = null;
    current_q.pointsAvailable = 1;
    current_q.prompt = null;
    current_q.question = row_data[1];
    current_q.questionNumber = row_data[0];
    current_q.questionType = row_data[4];
    current_q.reference = row_data[12];
    current_q.regionalApplicability = [];
    current_q.responseType = row_data[8];
    current_q.roles = [];
    current_q.weighting = 1;

    //handle parent-child
    var parentQNum = row_data[6];
    if (parentQNum == '') {
      current_q.child = false;
      current_q.trigger = { responses: [] };
    } else {
      var parentQID = num_to_id_map[parseInt(parentQNum)];
      var parentQuestion = Object.values(all_questions).filter(
        (q) => q._id === parentQID
      )[0];
      current_q.child = true;
      current_q.trigger = {
        parent: parentQID,
        parentQuestion: parentQuestion['question'],
      };
      let trigger_response_ids = []
      console.log('q', question_rows)
      for (var i = 0; i < question_rows.length; i++) {
        let trigger_response = question_rows[i][7];
        if (trigger_response != '') {
          let response_obj = Object.values(parentQuestion["responses"]).filter(
            (response) => response.indicator === trigger_response
          )[0];
          trigger_response_ids.push(response_obj._id)
        }
      }
      current_q.trigger["responses"] = trigger_response_ids
    }

    //set the dimension index
    let dimension = Object.values(dimensions).filter(
      (sdim) => sdim.name === row_data[2]
    );
    current_q.trustIndexDimension = dimension[0].dimensionID;

    if (dimension[0].dimensionID != 1) {
      let subdimension = Object.values(subdimensions).filter(
        (sdim) => sdim.name === row_data[3]
      );
      current_q.subDimension = subdimension[0].subDimensionID;
    }
    let responses = [];
    let rec_links = [];
    for (var i = 0; i < question_rows.length; i++) {
      let row_i = question_rows[i];
      let r = {};
      r['responseNumber'] = i;
      if (row_i[9] != '') {
        r['indicator'] = row_i[9];
        r['score'] = parseFloat(row_i[10]);
        responses.push(r);
      }
      if (row_i[14] != '' && row_i[14] != null) {
        rec_links.push(row_i[14]);
      }
    }
    current_q.responses = responses;
    current_q.rec_links = rec_links;
    return current_q;
  };

  let onFileUpload = async () => {
    let questions = questionsFile.split('\r\n');
    // let q_num_to_id = {};
    let fields = questions[0];
    for (var i = 1; i < questions.length; i++) {
      let row_data = questions[i].split('\t');
      if (row_data[0] != '') {
        let rows_for_question = [];
        rows_for_question.push(row_data);
        let localI = i + 1;
        while (localI < questions.length && questions[localI][0] == '\t') {
          rows_for_question.push(questions[localI].split('\t'));
          localI += 1;
        }
        let q = createQuestion(rows_for_question, q_num_to_id);
        await api.post('questions/', q).then((res) => {
          const result = res.data;
          if (result.errors) {
            console.log(result.errors);
          } else {
            console.log('Added Question: ', result);
            q_num_to_id[result['questionNumber']] = result['_id'];
            all_questions.push(result);
          }
        });
      }
    }

    // window.location.reload(false);

    //     }
  };
  let close = () => {
    props.onHide();
  };
  // let onFileChange = async event => {
  //   await setFile(event.target.files[0])

  // };
  fileReader.onload = async (event) => {
    await setQuestionsFile(event.target.result);
  };
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.show}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Upload Questions
          </Modal.Title>
          {/* <IconButton size="small" onClick={() => close()} label="Close">
            <CloseIcon />
          </IconButton> */}
        </Modal.Header>
        <Modal.Body>
          <Files
            className="files-dropzone"
            onChange={(file) => {
              fileReader.readAsText(file[0]);
            }}
            onError={(err) => console.log(err)}
            accepts={['.tsv']}
            multiple
            maxFiles={3}
            maxFileSize={10000000}
            minFileSize={0}
            clickable
          >
            <button>Choose .tsv file</button>
          </Files>
        </Modal.Body>
        <Modal.Body>
          {/* <input type="file" onChange={onFileChange} /> */}
          <button onClick={onFileUpload}>Upload!</button>
          {/* </div> */}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
