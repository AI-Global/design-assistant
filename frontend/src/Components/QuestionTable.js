import React, { Component } from 'react';
import Add from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
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
        super(props)
        this.state = {
            questions: this.props.questions,
        }
        this.onDragEnd = this.onDragEnd.bind(this)
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
        console.log("Parent:", result.destination.index-1)
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton aria-label="add question" size="small">
                                    <Add />
                                </IconButton>
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
