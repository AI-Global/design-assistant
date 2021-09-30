import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import assessmentCardsData from '../assets/data/assessmentCardData.json';

const img = new Image();
const user1 = (img.src = '../img/user1.png');
const user2 = (img.src = '../img/user2.png');
const user3 = (img.src = '../img/user3.png');

const useStyles = makeStyles({
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
    backgroundColor: '#EFF0F2',
    height: '1000px',
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
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
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
});

const ExpandButton = withStyles(() => ({
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

const AssessmentButton = withStyles(() => ({
  root: {
    borderRadius: '12px',
    border: '1px solid',
    color: '#000000',
    backgroundColor: '#ECB22E',
    borderColor: '#ECB22E',
  },
}))(Button);

export default function AssessmentCards(props) {
  const classes = useStyles();
  const { title, description } = props;
  const [expandButton, setExpandButton] = React.useState(false);

  const handleExpandButton = () => {
    setExpandButton(!expandButton);
  };

  const handleCardColor = (color) => {
    switch (color) {
      case 'robustColor':
        return classes.robustColor;
      case 'accountabilityColor':
        return classes.accountabilityColor;
      case 'dataQualityColor':
        return classes.dataQualityColor;
      case 'biasColor':
        return classes.biasColor;
      case 'otherColor':
        return classes.otherColor;
      default:
    }
  };

  return (
    <div className={classes.background}>
      <div className={classes.test}>
        <div
          className={
            expandButton ? classes.largeTitleText : classes.assessmentTitle
          }
        >
          What do Assessments Cover?
        </div>

        <div className={classes.end}>
          <ExpandButton onClick={handleExpandButton}>
            {expandButton ? 'Collapse' : 'Expand'}
          </ExpandButton>
        </div>
      </div>
      {expandButton && (
        <div className={classes.expandBackground}>
          <div className={classes.cardRow}>
            {assessmentCardsData.map((cards, i) => (
              <Card className={classes.root}>
                <div className={classes.cardTitle}>{cards.title}</div>
                <CardContent className={classes.cardContent}>
                  {cards.description}
                </CardContent>
                <CardActions
                  className={handleCardColor(cards.color)}
                ></CardActions>
              </Card>
            ))}
          </div>
          <AssessmentButton>Data</AssessmentButton>
          <AssessmentButton>Model</AssessmentButton>
          <AssessmentButton>Context</AssessmentButton>
          <Box mt={20} />
          <div className={classes.center}>
            <div className={classes.largeTitleText}>
              Do I do the assessment alone or with my colleague?
            </div>
          </div>
          <Box mt={20} />
          <div className={classes.row}>
            <div className={classes.column}>
              <div className={classes.largeTitleText}>You can start alone</div>
              <Box mt={10} />
              <img className={classes.imgStyle} src={user1}></img>
            </div>
            <div className={classes.column}>
              <div className={classes.largeTitleText}>
                But later you will need a team
              </div>
              <Box mt={10} />
              <div className={classes.row}>
                <img src={user2}></img>
                <img src={user1}></img>
                <img src={user3}></img>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
