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
import ChildModal from './ChildModal';
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
        super(props)
        this.state = {
            questions: this.props.questions,
            modalShow: false
        }
        this.onDragEnd = this.onDragEnd.bind(this)
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
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

        const qList = Array.from(this.state.questions);
        console.log("LIST:" );
        console.log(qList[0].questionNumber);


        if(result.destination.index != 0){
            this.setState({
                questions,
                currentQuestion: qList[result.destination.index],
                previousQuestion: qList[result.destination.index-1],
                showChildModal: true
            })
        } else{
            // do not ask to make a child-parent relationship
            this.setState({
                questions
            })
        }
        console.log("Source:", result.source.index)
        console.log("Parent:", result.destination.index - 1)
    }

    addQuestion() {
        // TODO: API call to add new question to DB
        this.handleOpenModal()
        console.log("Add Question")
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    setChildModalShow(val){
        this.setState({showChildModal: val});
    }

    makeRelationship(){
        this.setChildModalShow(false);
        console.log("in make relationship");
        // TODO: Add functionality to make question child of parent
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <ChildModal
                    show={this.state.showChildModal}
                    onHide={() => this.setChildModalShow(false)}
                    clickYes={() => this.makeRelationship()}
                    current_question={this.state.currentQuestion}
                    previous_question={this.state.previousQuestion}
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton aria-label="add question" size="small" onClick={() => this.addQuestion()}>
                                    <Add />
                                </IconButton>
                                <QuestionModal
                                    show={this.state.showModal}
                                    onHide={this.handleCloseModal}
                                    // TODO: probably a better way to load empty question template into modal
                                    question={{
                                        "_id": {
                                            "$oid": "5f992cbad17b20d5d4201d58"
                                        },
                                        "questionNumber": 0,
                                        "__v": 0,
                                        "alt_text": "\r",
                                        "domainApplicability": null,
                                        "lifecycle": 5,
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
                                            12
                                        ],
                                        "trustIndexDimension": null,
                                        "weighting": 0
                                    }}
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
                            <TableRow component={DraggableComponent(question._id.$oid, index)} key={question._id.$oid}>
                                <QuestionRow question={question} index={index} />
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