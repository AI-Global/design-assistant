import axios from 'axios';
import React, { Component } from 'react';
import Add from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import QuestionModal from './QuestionModal';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import QuestionRow from '../Components/QuestionRow';
import IconButton from '@material-ui/core/IconButton';
import TableContainer from '@material-ui/core/TableContainer';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,
    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
})

export default class QuestionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: {},
            dimensions: {}
        }
        this.onDragEnd = this.onDragEnd.bind(this)
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
    }

    componentDidMount() {
        this.getQuestions();
    }

    async getQuestions() {
        var endPoint = '/questions/all';
        await axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(res => {
                this.setState({ dimensions: res.data.Dimensions });
                this.setState({ questions: res.data.questions });
            })
        console.log(this.state.questions)
    }


    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        const questions = reorder(
            this.state.questions,
            result.source.index,
            result.destination.index
        )

        this.setState({
            questions
        })
        console.log("Source:", result.source.index)
        console.log("Parent:", result.destination.index - 1)
    }

    addQuestion() {
        this.handleOpenModal()
    }

    handleOpenModal() {
        this.setState({ modalShow: true });

    }

    handleCloseModal() {
        this.setState({ modalShow: false });
        this.getQuestions();
    }

    render() {
        if (!this.state.questions.length) {
            return null;
        }

        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton aria-label="add question" size="small" onClick={() => this.addQuestion()}>
                                    <Add />
                                </IconButton>
                                <QuestionModal
                                    show={this.state.modalShow}
                                    onHide={this.handleCloseModal}
                                    question={{
                                        "questionNumber": 0,
                                        "__v": 0,
                                        "alt_text": null,
                                        "domainApplicability": null,
                                        "lifecycle": 6,
                                        "mandatory": true,
                                        "parent": null,
                                        "pointsAvailable": 0,
                                        "prompt": null,
                                        "question": null,
                                        "questionType": null,
                                        "reference": null,
                                        "regionalApplicability": null,
                                        "responseType": null,
                                        "responses": [],
                                        "roles": [
                                            13
                                        ],
                                        "trustIndexDimension": null,
                                        "weighting": 0
                                    }}
                                    mode={"new"}
                                    dimensions={this.state.dimensions}
                                />
                            </TableCell>
                            <TableCell>No.</TableCell>
                            <TableCell>Question</TableCell>
                            <TableCell align="right">Dimension</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody component={DroppableComponent(this.onDragEnd)}>
                        {this.state.questions.map((question, index) => (
                            <TableRow component={DraggableComponent(question._id, index)} key={question._id}>
                                <QuestionRow
                                    question={question}
                                    dimensions={this.state.dimensions}
                                    index={index}
                                    onDelete={this.getQuestions}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
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
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    {...props}
                >
                    {props.children}
                </TableRow>
            )}
        </Draggable>
    )
}

const DroppableComponent = (
    onDragEnd: (result, provided) => void) => (props) => {
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={'1'} direction="vertical">
                    {(provided) => {
                        return (
                            <TableBody ref={provided.innerRef} {...provided.droppableProps} {...props}>
                                {props.children}
                                {provided.placeholder}
                            </TableBody>
                        )
                    }}
                </Droppable>
            </DragDropContext>
        )
    }