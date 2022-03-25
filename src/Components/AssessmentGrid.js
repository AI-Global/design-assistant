import React from 'react';

import {
  Table,
  Box,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
} from '@material-ui/core';

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
  const { submissions, handleDelete, collabRole, handleResume } = props;
  const classes = useStyles();
  const theme = useTheme();

  const [page, setPage] = React.useState(Number(localStorage.getItem('page')) || 0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  function createData(name, status, assessmentType, risk, date, action) {
    return { name, status, assessmentType, risk, date, action };
  }

  const rowTitle = [
    'Project Name',
    'Product Owner',
    'Risk Level',
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
                  <StyledTableCell className={classes.anthemBlue}>
                    {submission.projectName === ''
                      ? `Unnamed Project (${submission._id})`
                      : submission.projectName}
                  </StyledTableCell>
                  <StyledTableCell>{submission.users.username}</StyledTableCell>

                  <StyledTableCell>
                    {submission.riskLevel && (
                      <Chip
                        label={submission.riskLevel}
                        className={handleChipColor(submission.riskLevel)}
                      ></Chip>
                    )}
                  </StyledTableCell>
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
                              handleDelete();
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
    </div>
  );
}
