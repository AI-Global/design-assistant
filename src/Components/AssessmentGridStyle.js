import { TableCell, TableRow, Typography, TextField } from '@material-ui/core';
import { withStyles, createStyles, makeStyles } from '@material-ui/styles';

export const StyledTableCell = withStyles(() => ({
  root: {
    color: '#5A6C83',
    // remove this to make the cells change colors. return to later
    backgroundColor: 'white',
    height: '100px',
  },
}))(TableCell);

export const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'white',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#F3F5F7',
    },
  },
}))(TableRow);

export const CaptionTypography = withStyles(() => ({
  root: {
    color: '#C5C7CD',
  },
}))(Typography);

export const SearchBar = withStyles(() => ({
  root: {
    backgroundColor: '#FFFFFF',
    color: '#5A6C83',
  },
}))(TextField);

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    table: {
      minWidth: 650,
    },
    anthemBlue: {
      color: '#386EDA',
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
    tableHead: {
      backgroundColor: '#FFFFFF',
    },
    searchPadding: {
      padding: 30,
    },
  })
);
