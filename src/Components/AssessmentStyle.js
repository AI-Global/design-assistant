import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const useStyles = makeStyles({
  root: {
    width: '240px',
    height: '210px',
    borderRadius: '10px',
  },
  outerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '90%',
    bottom: '100px',
  },
  expandButtonEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '33%',
  },
  assessmentTitle: {
    fontSize: '36px',
  },
});

export const ExpandButton = withStyles(() => ({
  root: {
    borderRadius: '8px',
    border: '1px solid',
    borderColor: '#386EDA',
    color: '#386EDA',
    '&:hover': {
      backgroundColor: '#386EDA',
      borderColor: '#386EDA',
      color: '#FFFFFF',
    },
  },
}))(Button);

export const AssessmentButton = withStyles(() => ({
  root: {
    borderRadius: '12px',
    border: '1px solid',
    color: '#000000',
    backgroundColor: '#8D9FB6',
    borderColor: '#8D9FB6',
    width: '180px',
    height: '62px',
  },
}))(Button);
