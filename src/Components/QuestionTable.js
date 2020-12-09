import axios from 'axios';
import '../css/admin.css';
import ChildModal from './ChildModal';
import React, { Component } from 'react';
import Add from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import QuestionModal from './QuestionModal';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import QuestionRow from '../Components/QuestionRow';
import IconButton from '@material-ui/core/IconButton';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
      metadata: {},
      previousQuestion: null,
      currentQuestion: null,
      previousNumber: null,
      newNumber: null,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
  }

  componentDidMount() {
    var endPoint = '/metadata';
    axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint).then((res) => {
      this.setState({ metadata: res.data });
    });
    this.getQuestions();
  }

  async getQuestions() {
    var endPoint = '/questions/all';
    await axios
      .get(process.env.REACT_APP_SERVER_ADDR + endPoint)
      .then((res) => {
        this.setState({ dimensions: res.data.Dimensions });
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
      var endPoint =
        '/questions/' + (result.source.index + 1).toString() + '/1';
      await axios.put(process.env.REACT_APP_SERVER_ADDR + endPoint).then(() => {
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

  updateQuestionNumbers() {
    this.setChildModalShow(false);
    var endPoint =
      '/questions/' +
      this.state.previousNumber.toString() +
      '/' +
      this.state.newNumber.toString();
    axios
      .put(
        process.env.REACT_APP_SERVER_ADDR + endPoint,
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
    var endPoint = '/questions/all/export';
    var fileName = fileExt === 'json' ? 'json' : 'csv';
    if (fileExt === 'json') {
      await axios({
        url: process.env.REACT_APP_SERVER_ADDR + endPoint,
        method: 'GET',
        responseType: 'blob',
      }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'questions_' + fileName + '.' + fileExt);
        document.body.appendChild(link);
        link.click();
      });
    } else {
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
    }
  }

  render() {
    if (!this.state.questions.length) {
      return null;
    }
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
      questionType: 'tombstone',
      reference: null,
      regionalApplicability: [],
      responseType: 'text',
      responses: [],
      roles: [],
      trustIndexDimension: 1,
      weighting: 0,
      trigger: null,
      child: false,
      rec_links: [],
    };

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
                  metadata={this.state.metadata}
                />
              </TableCell>
              <TableCell>No.</TableCell>
              <TableCell>Question</TableCell>
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
                </DropdownButton>
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
