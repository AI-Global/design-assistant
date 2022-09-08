import { withStyles } from '@material-ui/core/styles';
import {
  LinearProgress,
  Typography,
  Stepper as muStepper,
} from '@material-ui/core';

export const DimensionProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: '20px',
  },
  colorPrimary: {
    backgroundColor: '#F3F5F7',
  },
  bar: {
    borderRadius: '20px',
    backgroundColor: '#0066ff',
  },
}))(LinearProgress);

export const OverallProgress = withStyles((theme) => ({
  root: {
    height: 25,
    borderRadius: '20px',
  },
  colorPrimary: {
    backgroundColor: '#F3F5F7',
  },
  bar: {
    borderRadius: '20px',
    backgroundColor: '#0066ff',
  },
}))(LinearProgress);

export const DimensionProgressPercent = withStyles({
  root: {
    color: '#8D9FB6',
  },
})(Typography);

export const Label = withStyles({
  root: {
    color: '#0066ff',
    whiteSpace: 'nowrap',
  },
})(Typography);

export const Stepper = withStyles({
  root: {
    border: '1px solid #C9D7E9',
    borderRadius: '10px',
    marginBottom: '2rem',
  },
})(muStepper);
