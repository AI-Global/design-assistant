import ReactDOM from "react-dom";
import React, { Component, useState } from "react";
import { DropdownButton, Dropdown, Button, Modal } from 'react-bootstrap';
import api from '../api';
import Files from "react-files";
export default function FileModal(visible) {
  let [jsonFile, setJsonFile] = useState([])
  let fileReader = new FileReader();

  let onFileUpload = async () => {
    let questions = jsonFile
    for (var i = 0; i < questions.length; i++) {
      console.log(questions[i])
    }
  }
  // let onFileChange = async event => {
  //   await setFile(event.target.files[0])


  // };
  fileReader.onload = async event => {
    await setJsonFile(JSON.parse(event.target.result));
    console.log('herrree')
  };
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={false}
        backdrop="static"
        keyboard={false}
      >
        {' '}
        <Modal.Body>
          Upload json file to populate questions
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
            accepts={[".json"]}
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

