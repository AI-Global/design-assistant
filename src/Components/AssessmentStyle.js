import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const useStyles = makeStyles({
  root: {
    width: '240px',
    height: '210px',
    borderRadius: '10px',
  },
  assessmentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  assessmentCardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '60%',
  },
  outterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '90%',
    padding: 30,
  },
  expandButtonEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '33%',
  },
  assessmentTitle: {
    fontSize: '36px',
  },
  chipContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  chipRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '65%',
  },
  stepperColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assessmentColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBackgroundColor: {
    backgroundColor: 'white',
  },
  peopleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  peopleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  peopleColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  assessmentImages: {
    width: '80%',
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
