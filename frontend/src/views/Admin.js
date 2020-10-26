import { Link } from 'react-router-dom';
import React, { Component } from 'react';

import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Tabs, Tab, } from 'react-bootstrap';

import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

//TODO: replace this with backend API to get JSON from mongoDB
const questionsJSON = require('../questionsJSON.json')
// console.log(questionsJSON)
const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
            fontSize: '16px',
        },
    },
});

function QuestionModal(props) {
    return (
      <Modal
        {...props}                                                                     
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{props.question.question}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }

function Row(props) {

    const { question, index } = props;
    const [open, setOpen] = React.useState(false);
    const [modalShow, setModalShow] = React.useState(false);

    const classes = useRowStyles();

    return (
        <React.Fragment>
        <QuestionModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        question={question}
        />
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell >{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                    {question.question}
                </TableCell>
                <TableCell align="right">{question.trustIndexDimension ? question.trustIndexDimension : 'Details'}</TableCell>
                <TableCell><Button onClick={() => setModalShow(true)}>Edit</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box paddingLeft={14} paddingRight={11} paddingBottom={4}>
                            {/* sub-table to show question responses and response scores - do not render if free text response */}
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
                            {/* sub-table to show meta-data for question - apply N/A to any fields missing */}
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
                            {/* sub-table to display alt-test (tootip pop up text) - do not render if question does not have it, just make empty Box DOM */}
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
            </TableRow>
        </React.Fragment>
    )
}

export default class Results extends Component {
    // Request questions JSON from backend 
    constructor(props) {
        super(props);
        this.state = {
            json: [],
            questions: []
        }
    }

    render() {
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                <h1 className="section-header">
                    Administration
                </h1>
                <Tabs defaultActiveKey="surveyManagement">
                    <Tab eventKey="surveyManagement" title="Survey Management">
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>No.</TableCell>
                                        <TableCell>Question</TableCell>
                                        <TableCell align="right">Dimension</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {questionsJSON.map((question, index) => (
                                        <Row key={question.questionNumber} question={question} index={index} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Tab>
                    <Tab eventKey="userManagement" title="Users">
                        <div className="table-responsive mt-3">
                            <Table id="users" bordered="true" hover="true" responsive="true" className="user-table">
                                <thead>
                                    <tr>
                                        <th className="score-card-headers">
                                            No.
                                        </th>
                                        <th className="score-card-headers">
                                            User Name
                                        </th>
                                        <th className="score-card-headers">
                                            User Email
                                        </th>
                                        <th className="score-card-headers">
                                            User Type
                                        </th>
                                        <th className="score-card-headers">
                                            User Role
                                        </th>
                                        <th className="score-card-headers">
                                            User Submissions
                                        </th>
                                        <th className="score-card-headers">
                                            User Score
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Michael</td>
                                        <td>michaeljackson@pop.com</td>
                                        <td>Registered</td>
                                        <td>1</td>
                                        <td>
                                            <Link to='/Results'>
                                                <input type='button' value='View Responses' />
                                            </Link>
                                        </td>
                                        <td>95</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="analytics" title="Analytics">
                        <div className="table-responsive mt-3">
                            <Table id="analytics" bordered="true" hover="true" responsive="true" className="analytics-table">
                            </Table>
                        </div>
                    </Tab>
                </Tabs>
            </main>
        )
    }
}
