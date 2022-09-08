import React, { useState } from 'react';

import {
  Table,
  Box,
  Button,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  Typography,
} from '@material-ui/core';

import {
  ModalBody,
  ModalTitle,
  ModalFooter,
  Modal,
} from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';

import Pagination from '@material-ui/lab/Pagination';
import { Search, DeleteRounded, AccountBox } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';

import {
  StyledTableCell,
  StyledTableRow,
  CaptionTypography,
  SearchBar,
  useStyles,
} from './AssessmentGridStyle';

export default function AssessmentGrid(props) {
  const { handleDelete, collabRole, handleResume, user } = props;
  const submissions = props.submissions.filter(s => s.userId === user._id);
  const classes = useStyles();
  const theme = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionIndex, setSubmissionIndex] = useState(null);

  const [page, setPage] = React.useState(Number(localStorage.getItem('page')) || 0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  function createData(name, status, assessmentType, risk, date, action) {
    return { name, status, assessmentType, risk, date, action };
  }

  const rowTitle = [
    'System Name',
    'Product Owner',
    'Status',
    'Action',
  ];

  const handleChipColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return classes.lowRisk;
      case 'Medium':
        return classes.mediumRisk;
      case 'High':
        return classes.highRisk;
      default:
    }
  };

  const handleChangePage = (event, newPage) => {
    localStorage.setItem('page', newPage);
    setPage(newPage);
  };
  const handleChangeRows = (event) => {
    setRowsPerPage(event.target.value);
  };

  return (
    <div>
      <Typography style={{
        fontSize: '30px',
        fontWeight: 700,
        fontFamily: 'helvetica'
      }}>
        My Assessments
      </Typography>
      <Box mb={5} />
      <TableContainer
        className={classes.tableContainer}
        component={Paper}
        elevation={4}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {rowTitle.map((title, i) => (
                <StyledTableCell key={title}>{title}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((submission, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell
                    className={classes.anthemBlue}
                    onClick={() => {
                      handleResume(i);
                    }}>
                    {submission.projectName === ''
                      ? `Unnamed Project (${submission._id})`
                      : submission.projectName}
                  </StyledTableCell>
                  <StyledTableCell>{submission.users.username}</StyledTableCell>
                  <StyledTableCell>
                    {submission.completed ? 'Completed' : 'In Progress'}
                    <CaptionTypography>
                      {' '}
                      {new Date(submission.date).toLocaleString('en-US', {
                        timeZone:
                          Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ??
                          'UTC',
                      })}
                    </CaptionTypography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '50%',
                      }}
                    >
                      {collabRole !== 'legalCompliance' &&
                        !submission.completed && (
                          <DeleteRounded
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setShowDeleteModal(true);
                              setSubmissionIndex(i);
                            }}
                          />
                        )}
                      <AccountBox
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          handleResume(i);
                        }}
                      />
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={10} />
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <TablePagination
          component="div"
          count={submissions.length}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRows}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          page={(page > 0 && submissions.length < rowsPerPage) ? 0 : page}
        />
      </div>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showDeleteModal}
      >
        <ModalHeader>
          <ModalTitle id="contained-modal-title-vcenter">
            Are you sure you want to delete this submission?
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>
            This action is permanent and cannot be recovered.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outlined"
            color="primary"
            className="mr-2"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleDelete(submissionIndex);
              setShowDeleteModal(false);
              setSubmissionIndex(null);
            }}
          >
            Delete Forever
          </Button>
        </ModalFooter>
      </Modal>
    </div >
  );
}
