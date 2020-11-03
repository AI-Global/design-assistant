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
    const { question, index } = props;
    const [questionModalShow, setQuestionModalShow] = React.useState(false);
    const [childModalShow, setChildModalShow] = React.useState(true);
    const classes = useRowStyles();
    const dimensionJSON = require('../dimensionJSON.json')

    return (
        <React.Fragment>
            <QuestionModal
                show={questionModalShow}
                onHide={() => setQuestionModalShow(false)}
                question={question}
            />
            <TableCell className={classes.tablecell}>
                {/* <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton> */}
            </TableCell>
            <TableCell className={classes.tablecell}>{index}</TableCell>
            <TableCell className={classes.tablecell} component="th" scope="row">
                {question.question}
            </TableCell>
            <TableCell className={classes.tablecell} align="right">{(question.trustIndexDimension !== null) ? dimensionJSON[question.trustIndexDimension].name : 'Details'}</TableCell>
            <TableCell className={classes.tabecell}><Button onClick={() => setQuestionModalShow(true)}>Edit</Button></TableCell>

            {/* <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box paddingLeft={14} paddingRight={11} paddingBottom={4}>
                            sub-table to show question responses and response scores - do not render if free text response
                            {(question.responseType === "text" || question.responseType === "comment") ? <Box /> :
                                <Table size="small" aria-label="responses">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Responses - {question.responseType}</TableCell>
                                            <TableCell align="right">Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {question.responses.map((response, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{response.indicator}</TableCell>
                                                <TableCell align="right">{response.score}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>}
                            sub-table to show meta-data for question - apply N/A to any fields missing
                            <Table size="small" aria-label="metadata">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Domain</TableCell>
                                        <TableCell>Region</TableCell>
                                        <TableCell>Life-Cycle</TableCell>
                                        <TableCell align="right">Points</TableCell>
                                        <TableCell align="right">Weighting</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{question.roles}</TableCell>
                                        <TableCell>{question.domainApplicability ? question.domainApplicability : 'N/A'}</TableCell>
                                        <TableCell>{question.regionalApplicability ? question.regionalApplicability : 'N/A'}</TableCell>
                                        <TableCell>{question.lifecylce ? question.lifecylce : 'N/A'}</TableCell>
                                        <TableCell align="right">{question.pointsAvailable}</TableCell>
                                        <TableCell align="right">{question.weighting}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            sub-table to display alt-test (tootip pop up text) - do not render if question does not have it, just make empty Box DOM
                            {(question.alt_text === "\r") ? <Box /> :
                                <Table size="small" aria-label="alttext">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Helper Text</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{question.alt_text}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow> */}
        </React.Fragment>
    )
}