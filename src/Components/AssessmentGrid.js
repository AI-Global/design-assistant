import React from 'react';
import Box from '@material-ui/core/Box';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import Pagination from '@material-ui/lab/Pagination';

import Search from '@material-ui/icons/Search';
import FileCopyRounded from '@material-ui/icons/FileCopyRounded';
import DeleteRounded from '@material-ui/icons/DeleteRounded';
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
  const { expandButton } = props;
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
                  <FileCopyRounded className={classes.anthemBlue} /> Clone
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
