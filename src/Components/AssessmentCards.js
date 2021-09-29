import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import assessmentCardsData from '../assets/data/assessmentCardData.json';

const useStyles = makeStyles({
  root: {
    width: '240px',
    height: '210px',
    borderRadius: '10px',
  },
  background: {
    backgroundColor: '#EFF0F2',
  },
  expandBackground: {
    height: '300px',
    backgroundColor: '#EFF0F2',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    fontWeight: 'bold',
  },
  cardActionStyle: {
    backgroundColor: 'red',
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  robustColor: {
    color: '#4653EF',
  },
  accountabilityColor: {
    color: '#9CA3FF',
  },
  dataQualityColor: {
    color: '#8D9FB6',
  },
  biasColor: {
    color: '#A998A7',
  },
  otherColor: {
    color: '#C9D7E9',
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

export default function AssessmentCards(props) {
  const classes = useStyles();
  const { title, description } = props;
  const [expandButton, setExpandButton] = React.useState(false);

  const handleExpandButton = () => {
    setExpandButton(!expandButton);
  };

  const handleCardColor = (color) => {
    switch (color) {
      case 'settings':
        return classses.robustColor;
      case 'library':
        return classses.accountabilityColor;
      case 'find':
        return classses.dataQualityColor;
      case 'people':
        return classses.biasColor;
      case 'people':
        return classses.otherColor;
      default:
    }
  };
  return (
    <div className={classes.background}>
      {!expandButton && (
        <div>
          What Does Assessment cover
          <div>
            <ExpandButton onClick={handleExpandButton}>Expand</ExpandButton>
          </div>
        </div>
      )}
      {expandButton && (
        <div className={classes.expandBackground}>
          <div>What does Assessment cover? </div>
          <div className={classes.cardRow}>
            {assessmentCardsData.map((cards, i) => (
              <Card className={classes.root}>
                <div className={classes.cardTitle}>{cards.title}</div>
                <CardContent className={classes.cardContent}>
                  {cards.description}
                </CardContent>
                <CardActions className={classes.cardActionStyle}></CardActions>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
