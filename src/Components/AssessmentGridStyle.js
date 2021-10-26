import { TableCell, TableRow, Typography } from '@material-ui/core';
import { withStyles, createStyles, makeStyles } from '@material-ui/styles';

export const StyledTableCell = withStyles(() => ({
  root: {
    backgroundColor: '#FFFFFF',
    color: '#5A6C83',
    height: '100px',
  },
}))(TableCell);

export const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'white',
    },
    '&:nth-of-type(even)': {
      backgroundColor: 'grey',
    },
  },
}))(TableRow);

export const CaptionTypography = withStyles(() => ({
  root: {
    color: '#C5C7CD',
  },
}))(Typography);

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    table: {
      minWidth: 650,
    },
    tableContainer: {
      height: '930px',
      borderRadius: 8,
      width: '75%',
      padding: 10,
    },
    innerTableContainer: {
      height: '760px',
      borderRadius: 8,
      marginLeft: 20,
      width: '96%',
      padding: 10,
    },
    gridButtons: {
      color: '#4653EF',
      width: '30px',
      height: '30px',
    },
    buttonRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    tableButton: {
      width: '30px',
      height: '30px',
    },
    downloadButton: {
      color: '#4653EF',
      marginLeft: '29px',
      width: '30px',
      height: '30px',
    },
    documentRow: {
      padding: 30,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
    },
    linkRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    buttonColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    pagination: {
      marginTop: 20,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'end',
    },
    lowRisk: {
      color: '#0A5C1F',
      backgroundColor: '#D9F7BE',
    },
    mediumRisk: {
      color: '#DC9F00',
      backgroundColor: '#FFE7A8',
    },
    highRisk: {
      color: '#A8071A',
      backgroundColor: '#FFD5D1',
    },
  })
);
