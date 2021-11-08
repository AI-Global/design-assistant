import React from 'react';

import {
  Table,
  Box,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Chip,
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';
import { Search, FileCopyRounded, DeleteRounded } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import assessmentGridData from '../assets/data/assessmentGridData.json';

import {
  StyledTableCell,
  StyledTableRow,
  CaptionTypography,
  SearchBar,
  useStyles,
} from './AssessmentGridStyle';

export default function AssessmentGrid(props) {
  const { expandButton, collabRoles } = props;
  const classes = useStyles();
  const theme = useTheme();

  function createData(name, status, assessmentType, risk, date, action) {
    return { name, status, assessmentType, risk, date, action };
  }

  const rowTitle = [
    'Project Name',
    'Status',
    'Assessment Type',
    'Risk Flag',
    'Action Date',
    'Action',
    '',
  ];

  const handleChipColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low Risk':
        return classes.lowRisk;
      case 'Medium Risk':
        return classes.mediumRisk;
      case 'High Risk':
        return classes.highRisk;
      default:
    }
  };

  return (
    <div>
      <TableContainer
        className={classes.tableContainer}
        component={Paper}
        elevation={4}
      >
        <div className={classes.searchPadding}>
          <SearchBar
            variant="outlined"
            placeholder="Search resources"
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </div>

        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            {rowTitle.map((title, i) => (
              <StyledTableCell>{title}</StyledTableCell>
            ))}
          </TableHead>
          <TableBody>
            {assessmentGridData.map((data, i) => (
              <StyledTableRow stripedRows key={i}>
                <StyledTableCell className={classes.anthemBlue}>
                  {data.name}
                </StyledTableCell>
                <StyledTableCell>
                  {data.status ? 'Completed' : 'In Progress'}
                  <CaptionTypography>{data.completedDate}</CaptionTypography>
                </StyledTableCell>
                <StyledTableCell>
                  {data.assessmentType}
                  <CaptionTypography>
                    {data.assessmentSubType}
                  </CaptionTypography>
                </StyledTableCell>
                <StyledTableCell>
                  <Chip
                    color="success"
                    label={data.risk}
                    className={handleChipColor(data.risk)}
                  ></Chip>
                </StyledTableCell>
                <StyledTableCell>{data.actionDate}</StyledTableCell>
                <StyledTableCell className={classes.anthemBlue}>
                  {collabRoles !== '"securityAdmin"' && (
                    <FileCopyRounded className={classes.anthemBlue} />
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  <DeleteRounded />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={10} />
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Pagination count={10} />
      </div>
    </div>
  );
}
