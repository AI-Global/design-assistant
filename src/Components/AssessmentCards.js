import React from 'react';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import assessmentCardsData from '../assets/data/assessmentCardData.json';

import { ExpandButton, useStyles } from './AssessmentCardStyle';

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
    <div>
      <div className={classes.cardContainer}>
        <div className={classes.cardRow}>
          <Card className={classes.root}>
            <div className={classes.cardTitle}>{title}</div>
            <CardContent className={classes.cardContent}>
              {description}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
