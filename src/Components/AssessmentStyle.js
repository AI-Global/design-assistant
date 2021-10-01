import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const useStyles = makeStyles({
  root: {
    width: '240px',
    height: '210px',
    borderRadius: '10px',
  },
  background: {
    backgroundColor: '#EFF0F2',
    position: 'relative',
    top: '-100px',
  },
  expandBackground: {
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    fontWeight: 'bold',
  },
  cardContent: {
    fontSize: '16px',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  robustColor: {
    backgroundColor: '#4653EF',
    marginTop: '23px',
  },
  accountabilityColor: {
    backgroundColor: '#9CA3FF',
  },
  dataQualityColor: {
    backgroundColor: '#8D9FB6',
  },
  biasColor: {
    backgroundColor: '#A998A7',
  },
  otherColor: {
    backgroundColor: '#C9D7E9',
    marginTop: '23px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  test: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '95%',
    padding: 30,
  },
  end: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '33%',
  },
  assessmentTitle: {
    fontSize: '36px',
    marginRight: 100,
  },
  largeTitleText: {
    fontSize: '52px',
  },
  assessmentButtonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  chipContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  chipRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '20%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyle: {
    height: '120px',
    width: '120px',
  },
  cardContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  stepperBackgroundColor: {
    backgroundColor: 'white',
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
  },
}))(Button);
