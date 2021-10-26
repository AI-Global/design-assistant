import React from 'react';
import Box from '@material-ui/core/Box';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import { useTheme } from '@material-ui/core/styles';

import assessmentGridData from '../assets/data/assessmentGridData.json';

import {
  StyledTableCell,
  StyledTableRow,
  useStyles,
} from './AssessmentGridStyle';

export default function AssessmentGrid(props) {
  const { expandButton } = props;
  const classes = useStyles();
  const theme = useTheme();

  function createData(name, status, assessmentType, risk, date, action) {
    return { name, status, assessmentType, risk, date, action };
  }

  const rows = [
    createData('Service Experience - Self Service', 159, 6.0, 24, 4.0),
    createData('Service Experience - Agent Assist', 159, 6.0, 24, 4.0),
    createData(
      'Service Experience - Intelligent Call Routing',
      159,
      6.0,
      24,
      4.0
    ),
    createData('Sales Acceleration - Medicare', 159, 6.0, 24, 4.0),
    createData(
      'Claims transformation - Digital Claimes Examiner',
      159,
      6.0,
      24,
      4.0
    ),
    createData('Claims transformation - Payment Integrity', 159, 6.0, 24, 4.0),
    createData(
      'Care Optimization - Increase Preventative Care',
      159,
      6.0,
      24,
      4.0
    ),
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
    <TableContainer
      className={classes.tableContainer}
      component={Paper}
      elevation={4}
    >
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow stripedRows>
            <StyledTableCell>Project Name</StyledTableCell>
            <StyledTableCell>Status </StyledTableCell>
            <StyledTableCell>Assessment Type</StyledTableCell>
            <StyledTableCell>Risk Flag</StyledTableCell>
            <StyledTableCell>Action Date</StyledTableCell>
            <StyledTableCell>Action </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assessmentGridData.map((data, i) => (
            <StyledTableRow stripedRows key={i}>
              <StyledTableCell>{data.name}</StyledTableCell>
              <StyledTableCell>
                {data.status ? 'Completed' : 'In Progress'}
              </StyledTableCell>
              <StyledTableCell>{data.assessmentType}</StyledTableCell>
              <StyledTableCell>
                <Chip
                  color="success"
                  label={data.risk}
                  className={handleChipColor(data.risk)}
                ></Chip>
              </StyledTableCell>
              <StyledTableCell>{data.actionDate}</StyledTableCell>
              {/* <StyledTableCell>{data.name}</StyledTableCell> */}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
