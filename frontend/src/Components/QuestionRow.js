import React from 'react';
// import Box from '@material-ui/core/Box';
// import Table from '@material-ui/core/Table';
import { Button } from 'react-bootstrap';
// import Collapse from '@material-ui/core/Collapse';
// import TableRow from '@material-ui/core/TableRow';
// import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
import { makeStyles } from '@material-ui/core/styles';
// import IconButton from '@material-ui/core/IconButton';
import QuestionModal from './QuestionModal';
// import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import Card from 'react-bootstrap/Card';

const useRowStyles = makeStyles({
    tablecell: {
        fontSize: '16px'
    }
});

export default function QuestionRow(props) {
    // const [open, setOpen] = React.useState(false);
    const { question, dimensions, index } = props;
    const [modalShow, setModalShow] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <QuestionModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                question={question}
                mode={"edit"}
                dimensions={dimensions}
            />
            <TableCell className={classes.tablecell}>
            </TableCell>
            <TableCell className={classes.tablecell}>{index}</TableCell>
            <TableCell className={classes.tablecell} component="th" scope="row">
                {question.question}
            </TableCell>
            <TableCell className={classes.tablecell} align="right">{(question.trustIndexDimension !== null) ? dimensions[question.trustIndexDimension].name : 'Details'}</TableCell>
            <TableCell className={classes.tabecell}><Button onClick={() => setModalShow(true)}>Edit</Button></TableCell>
        </React.Fragment>
    )
}