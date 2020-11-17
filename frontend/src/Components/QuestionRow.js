import React from 'react';
import { Button } from 'react-bootstrap';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import QuestionModal from './QuestionModal';

const useRowStyles = makeStyles({
    tablecell: {
        fontSize: '16px'
    }
});

export default function QuestionRow(props) {
    const { question, dimensions, index, metadata} = props;
    const [modalShow, setModalShow] = React.useState(false);
    const classes = useRowStyles();
    return (
        <React.Fragment>
            <QuestionModal
                id="question-modal"
                show={modalShow}
                onHide={() => {setModalShow(false); props.onDelete()}}
                question={question}
                mode={"edit"}
                dimensions={dimensions}
                metadata={metadata}
            />
            <TableCell className={classes.tablecell}>
                {question.child ? <div style={{ fontSize: "12px", fontStyle: "italic", color:"#8f8f8f"}}>Child</div> : null}
            </TableCell>
            <TableCell className={classes.tablecell}>{index+1}</TableCell>
            <TableCell className={classes.tablecell} component="th" scope="row">
                {question.question}
            </TableCell>
            <TableCell className={classes.tablecell} align="right">{(question.trustIndexDimension !== null) ? dimensions[question.trustIndexDimension].name : 'Details'}</TableCell>
            <TableCell className={classes.tabecell}><Button onClick={() => setModalShow(true)}>Edit</Button></TableCell>
        </React.Fragment>
    )
}