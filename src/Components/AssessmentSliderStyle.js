import { makeStyles } from '@material-ui/core/styles';

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
    alignItems: 'center',
    width: '40%',
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

  assessmentImages: {
    width: '80%',
  },
  arrowStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '5%',
    height: '5%',
    cursor: 'pointer',
  },
});
