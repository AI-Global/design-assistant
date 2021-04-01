import ReactDOM from "react-dom";
import React, { Component, useState } from "react";
import { DropdownButton, Dropdown, Button, Modal, } from 'react-bootstrap';
import api from '../api';
import Files from "react-files";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export default function FileModal(props) {
  let [questionsFile, setQuestionsFile] = useState([])
  // let [questionNumber, setQuestionNumber] = useState(props.numQuestions)
  let fileReader = new FileReader();
  let onFileUpload = async () => {
    let questions = questionsFile.split("\r\n")
    let fields = questions[0]
    for (var i = 1; i < questions.length; i++) {
      let current_q = {}
      let row_data = questions[i].split("\t")
      current_q.__v = 0
      current_q.alt_text = row_data[13]
      current_q.child = false //TODO implement child-trigger relations
      current_q.domainApplicability = []
      current_q.lifecycle = []
      current_q.mandatory = true
      current_q.parent = null
      current_q.pointsAvailable = 1
      current_q.prompt = null
      current_q.question = row_data[1]
      current_q.questionNumber = props.numQuestions + 1
      current_q.questionType = row_data[4]
      current_q.rec_links = [] //todo fix
      current_q.reference = null
      current_q.regionalApplicability = []
      current_q.responseType = "text" //todo temp for testing
      current_q.responses = [] //TODO must fix
      current_q.roles = []
      current_q.subDimension = 1
      current_q.trigger = null
      current_q.trustIndexDimension = 1
      current_q.weighting = 1
      // if (row_data) {

      // }
      console.log(current_q)
      await api.post('questions/', current_q).then((res) => {
        const result = res.data;
        if (result.errors) {
          console.log(result.errors);
        } else {
          console.log('Added Question: ', result);
        }
      });
      window.location.reload(false);

    }
    let close = () => {
      console.log('heeerre in file modal')
      props.onHide()

    }

    //     }
  }
  // let onFileChange = async event => {
  //   await setFile(event.target.files[0])


  // };
  fileReader.onload = async event => {
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
        <Modal.Body>
          Upload csv file to populate questions
          <div>
            {/* <input type="file" onChange={onFileChange} /> */}
            <button onClick={onFileUpload}>Upload!</button>
          </div>
          <Files
            className="files-dropzone"
            onChange={file => {
              fileReader.readAsText(file[0]);
            }}
            onError={err => console.log(err)}
            accepts={[".tsv"]}
            multiple
            maxFiles={3}
            maxFileSize={10000000}
            minFileSize={0}
            clickable
          >
            Drop files here or click to upload
        </Files>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

