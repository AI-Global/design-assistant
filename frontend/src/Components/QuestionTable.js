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


export default function QuestionTable(props) {
    var questions = props.questions;

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
                <TableBody>
                    {questions.map((question, index) => (
                        <QuestionRow key={question.questionNumber} question={question} index={index} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}