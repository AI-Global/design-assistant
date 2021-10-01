import React from 'react';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import assessmentCardsData from '../assets/data/assessmentCardData.json';

import {
  ExpandButton,
  AssessmentButton,
  useStyles,
} from './AssessmentCardStyle';

const img = new Image();
const user1 = (img.src = '../img/user1.png');
const user2 = (img.src = '../img/user2.png');
const user3 = (img.src = '../img/user3.png');

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
        <Box mt={20} />
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
          <div className={classes.cardContainer}>
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
          </div>
          <Box mt={5} />
          <div className={classes.chipContainer}>
            <div className={classes.chipRow}>
              <AssessmentButton>Data</AssessmentButton>
              <AssessmentButton>Model</AssessmentButton>
              <AssessmentButton>Context</AssessmentButton>
            </div>
          </div>
          <Box mt={40} />
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
