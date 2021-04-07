import api from '../api';
import '../css/admin.css';
import ChildModal from './ChildModal';
import React, { Component, useState } from 'react';
import Add from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import QuestionModal from './QuestionModal';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import QuestionRow from '../Components/QuestionRow';
import IconButton from '@material-ui/core/IconButton';
import { DropdownButton, Dropdown, Button, Modal } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FileModal from './FileModal';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,
  ...(isDragging && {
    background: 'rgb(235,235,235)',
  }),
});

export default class QuestionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: {},
      dimensions: {},
      subdimensions: {},
      metadata: {},
      previousQuestion: null,
      currentQuestion: null,
      previousNumber: null,
      newNumber: null,
    };

    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleFileModal = this.handleFileModal.bind(this);
    this.handleCloseFileModal = this.handleCloseFileModal.bind(this);

    this.getQuestions = this.getQuestions.bind(this);
  }
  componentDidMount() {
    api.get('metadata').then((res) => {
      this.setState({ metadata: res.data });
    });
    this.getQuestions();
  }

  async getQuestions() {
    await api.get('questions/all').then((res) => {
      this.setState({ dimensions: res.data.Dimensions });
      this.setState({ subdimensions: res.data.subDimensions });
      this.setState({
        questions: res.data.questions.sort((a, b) =>
          a.questionNumber > b.questionNumber ? 1 : -1
        ),
      });
    });
  }

  async onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const questions = reorder(
      this.state.questions,
      result.source.index,
      result.destination.index
    );

    if (result.destination.index !== 0) {
      this.setState({
        questions,
        currentQuestion: questions[result.destination.index],
        previousQuestion: questions[result.destination.index - 1],
        previousNumber: result.source.index + 1,
        newNumber: result.destination.index + 1,
        showChildModal: true,
      });
    } else {
      // do not ask to make a child-parent relationship
      await api
        .put('questions/' + (result.source.index + 1).toString() + '/1')
        .then(() => {
          console.log(
            'Question: ' +
            result.source.index.toString() +
            'is now question: ' +
            result.destination.index.toString()
          );
          this.setState({
            questions,
          });
        });
    }
  }

  addQuestion() {
    this.handleOpenModal();
  }

  handleOpenModal() {
    this.setState({ modalShow: true });
  }

  handleCloseModal() {
    this.setState({ modalShow: false });
    this.getQuestions();
  }
  handleFileModal() {
    this.setState({ fmodalShow: true });
  }
  handleCloseFileModal() {
    this.setState({ fmodalShow: false });
  }
  updateQuestionNumbers() {
    this.setChildModalShow(false);
    api
      .put(
        'questions/' +
        this.state.previousNumber.toString() +
        '/' +
        this.state.newNumber.toString(),
        this.state.currentQuestion.questionNumber
      )
      .then(() => {
        console.log(
          'Question: ' +
          this.state.previousNumber.toString() +
          'is now question: ' +
          this.state.newNumber.toString()
        );
      });
    // TODO: Add functionality to make question child of parent
  }

  cancelQuestionUpdate() {
    const questions = reorder(
      this.state.questions,
      this.state.newNumber - 1,
      this.state.previousNumber - 1
    );
    this.setState({
      questions,
    });

    this.setChildModalShow(false);
  }

  setChildModalShow(val) {
    this.setState({ showChildModal: val });
  }

  makeRelationship() {
    this.setChildModalShow(false);
    // TODO: Add functionality to make question child of parent
  }

  async export(fileExt) {
    if (fileExt === 'json') {
      await api
        .get('questions/all/export', { responseType: 'blob' })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'questions_' + fileName + '.' + fileExt
          );
          document.body.appendChild(link);
          link.click();
        });
    } else if (fileExt == 'csv') {
      var contentArr = [];
      // push headers into the contentArray
      const headers = Object.keys(this.state.questions[0]);
      contentArr.push(headers);

      // push question values into contentArray
      this.state.questions.forEach((question) => {
        var field = Object.values(question);

        for (let i in field) {
          if (typeof field[i] === 'object' && field[i] !== null) {
            field[i] = JSON.stringify(field[i]);
          }
          if (typeof field[i] === 'string') {
            field[i] =
              '"' + field[i].replaceAll('"', "''").replaceAll('#', '') + '"';
          }
        }
        contentArr.push(field);
      });

      let csvContent = 'data:text/csv;charset=utf-8,';

      contentArr.forEach(function (rowArray) {
        let row = rowArray.join(',');
        csvContent += row + '\r\n';
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'questions_' + fileName + '.' + fileExt);
      document.body.appendChild(link); // Required for FF

      link.click(); // This will download the data file named "my_data.csv".
    } else if (fileExt == 'tsv') {
      var contentArr = [];
      const headers = [
        'Question Number',
        'Question',
        'Dimension',
        'Subdimension',
        'Question Type',
        'points available',
        'Trigger Parent',
        'Trigger Response',
        'Response Type',
        'Responses',
        'Score',
        'weighting',
        'Reference',
        'Alt Text',
        'Link',
      ];
      contentArr.push(headers);
      // push question values into contentArray
      // ['Question Number', 'Question', 'Dimension', 'Subdimension', 'Question Type', 'points available', 'Trigger Parent', 'Trigger Response', 'Response Type', 'Responses', 'Score', 'weighting', 'Reference', 'Alt Text', 'Link'];
      this.state.questions.forEach((question) => {
        let row = [];
        row.push(question['questionNumber']);
        row.push(question['question']);
        let d_ID = question['trustIndexDimension'];
        let dimensionName = Object.values(this.state.dimensions).filter(
          (dim) => dim.dimensionID == d_ID
        )[0]?.name;
        row.push(dimensionName);

        let subdimension = '';
        if ('subDimension' in question) {
          subdimension = Object.values(this.state.subdimensions).filter(
            (s_dim) => s_dim.subDimensionID == question['subDimension']
          )[0]?.name;
        }
        row.push(subdimension);
        row.push(question['questionType']);
        row.push(question['pointsAvailable']);
        if (
          question['trigger'] != null &&
          question['trigger']['parent'] != null
        ) {
          var parentQuestion = Object.values(this.state.questions).filter(
            (q) => q._id == question["trigger"]["parent"]
          )[0]
          row.push(parentQuestion?.questionNumber)
          let triggerResponse = Object.values(parentQuestion?.responses).filter(
            (response) => response._id == question["trigger"]["responses"][0]
          )[0]
          row.push(triggerResponse?.indicator)
        } else {
          row.push(''); //for parent question for now; TODO implement this
          row.push(''); //for trigger resonponses for now TODO
        }
        //'Response Type', 'Responses', 'Score', 'weighting', 'Reference', 'Alt Text', 'Link'];
        row.push(question['responseType']);
        if (question['responses'].length > 0) {
          row.push(question['responses'][0]['indicator']);
          row.push(question['responses'][0]['score']);
        } else {
          row.push('');
          row.push('');
        }
        row.push(question['weighting']);
        row.push(question['reference']);
        row.push(question['alt_text']);
        if (question['rec_links'].length > 0) {
          row.push(question['rec_links'][0]);
        } else {
          row.push('');
        }
        contentArr.push(row);
        //TODO: handle links
        let numExtraRows = Math.max(
          question['responses'].length,
          question['rec_links'].length
        );
        numExtraRows = Math.max(numExtraRows, question['trigger']['responses'].length)
        //add the extra rows
        for (var i = 1; i <= numExtraRows; i++) {
          var extraRow = [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ];
          if (question['responses'].length > i) {
            extraRow[9] = question['responses'][i]['indicator'];
            extraRow[10] = question['responses'][i]['score'];
          }
          if (question['rec_links'].length > i) {
            extraRow[14] = question['rec_links'][i];
          }
          if (
            question['trigger'] != null &&
            question['trigger']['parent'] != null &&
            question["trigger"]['responses'].length > i
          ) {
            let triggerResponse = Object.values(parentQuestion?.responses).filter(
              (response) => response._id == question["trigger"]["responses"][i]
            )[0]
            extraRow[7] = triggerResponse?.indicator
          }
          contentArr.push(extraRow);
        }
      });

      let tsvContent = 'data:text/tab-separated-values,';

      contentArr.forEach(function (rowArray) {
        let row = rowArray.join('\t');
        tsvContent += row + '\r\n';
      });

      var encodedUri = encodeURI(tsvContent);
      var link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'questions.' + fileExt);
      document.body.appendChild(link); // Required for FF
      link.click(); // This will download the data file named "my_data.csv"..location.href = "data:text/tab-separated-values," + encodeURIComponent(tsv);
    }
  }
  render() {
    const newQuestion = {
      questionNumber: this.state.questions.length + 1,
      __v: 0,
      alt_text: null,
      domainApplicability: [],
      lifecycle: [],
      mandatory: true,
      parent: null,
      pointsAvailable: 1,
      prompt: null,
      question: null,
      questionType: 'risk',
      reference: null,
      regionalApplicability: [],
      responseType: 'text',
      responses: [],
      roles: [],
      trustIndexDimension: 1,
      weighting: 1,
      trigger: null,
      child: false,
      rec_links: [],
    };
    if (!this.state.questions.length) {
      return (
        <div className="table-responsive mt-3">
          {this.state.previousQuestion === null ? null : (
            <ChildModal
              show={this.state.showChildModal}
              onHide={() => this.cancelQuestionUpdate()}
              clickYes={() => this.updateQuestionNumbers()}
              current_question={this.state.currentQuestion}
              previous_question={this.state.previousQuestion}
            />
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="add question"
                    size="small"
                    onClick={() => this.addQuestion()}
                  >
                    <Add />
                  </IconButton>
                  <QuestionModal
                    show={this.state.modalShow}
                    onHide={this.handleCloseModal}
                    question={newQuestion}
                    mode={'new'}
                    dimensions={this.state.dimensions}
                    subdimensions={this.state.subdimensions}
                    metadata={this.state.metadata}
                  />
                  <FileModal
                    show={this.state.fmodalShow}
                    onHide={this.handleCloseFileModal}
                    numQuestions={this.state.questions.length}
                    dimensions={this.state.dimensions}
                    subdimensions={this.state.subdimensions}
                    questions={this.state.questions}
                  ></FileModal>
                </TableCell>
                <TableCell>No.</TableCell>
                <TableCell width="100%">Question</TableCell>
                <TableCell align="right">Dimension</TableCell>
                <TableCell>
                  <DropdownButton
                    className="export-dropdown"
                    title={<i className="fas fa-file-export fa-lg" />}
                  >
                    <Dropdown.Item onClick={() => this.export('json')}>
                      .json
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.export('csv')}>
                      .csv
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.export('tsv')}>
                      .tsv (reupload questions on dashboard)
                    </Dropdown.Item>
                  </DropdownButton>
                </TableCell>
                <TableCell>
                  <Button disabled onClick={() => this.handleFileModal()}>
                    Upload
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </div>
      );
    }

    return (
      <div className="table-responsive mt-3">
        {this.state.previousQuestion === null ? null : (
          <ChildModal
            show={this.state.showChildModal}
            onHide={() => this.cancelQuestionUpdate()}
            clickYes={() => this.updateQuestionNumbers()}
            current_question={this.state.currentQuestion}
            previous_question={this.state.previousQuestion}
          />
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton
                  aria-label="add question"
                  size="small"
                  onClick={() => this.addQuestion()}
                >
                  <Add />
                </IconButton>
                <QuestionModal
                  show={this.state.modalShow}
                  onHide={this.handleCloseModal}
                  question={newQuestion}
                  mode={'new'}
                  dimensions={this.state.dimensions}
                  subdimensions={this.state.subdimensions}
                  metadata={this.state.metadata}
                />
                <FileModal
                  show={this.state.fmodalShow}
                  onHide={this.handleCloseFileModal}
                  dimensions={this.state.dimensions}
                  subdimensions={this.state.subdimensions}
                  questions={this.state.questions}
                ></FileModal>
              </TableCell>
              <TableCell>No.</TableCell>
              <TableCell width="100%">Question</TableCell>
              <TableCell align="right">Dimension</TableCell>
              <TableCell>
                <DropdownButton
                  className="export-dropdown"
                  title={<i className="fas fa-file-export fa-lg" />}
                >
                  <Dropdown.Item onClick={() => this.export('json')}>
                    .json
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.export('csv')}>
                    .csv
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.export('tsv')}>
                    .tsv (reupload questions on dashboard)
                  </Dropdown.Item>
                </DropdownButton>
              </TableCell>
              <TableCell>
                <Button disabled onClick={() => this.handleFileModal()}>
                  Upload
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody component={DroppableComponent(this.onDragEnd)}>
            {this.state.questions.map((question, index) => (
              <TableRow
                hover={true}
                component={DraggableComponent(question._id, index)}
                key={question._id}
              >
                <QuestionRow
                  question={question}
                  dimensions={this.state.dimensions}
                  subdimensions={this.state.subdimensions}
                  index={index}
                  onDelete={this.getQuestions}
                  metadata={this.state.metadata}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const DraggableComponent = (id, index) => (props) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          {...props}
        >
          {props.children}
        </TableRow>
      )}
    </Draggable>
  );
};

const DroppableComponent = (onDragEnd: (result, provided) => void) => (
  props
) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'1'} direction="vertical">
        {(provided) => {
          return (
            <TableBody
              ref={provided.innerRef}
              {...provided.droppableProps}
              {...props}
            >
              {props.children}
              {provided.placeholder}
            </TableBody>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};
