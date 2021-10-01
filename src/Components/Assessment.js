import React from 'react';
import Box from '@material-ui/core/Box';
import assessmentCardsData from '../assets/data/assessmentCardData.json';

import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {
  ExpandButton,
  AssessmentButton,
  useStyles,
} from './AssessmentCardStyle';

const img = new Image();
const user1 = (img.src = '../img/user1.png');
const user2 = (img.src = '../img/user2.png');
const user3 = (img.src = '../img/user3.png');

export default function Assessment(props) {
  const classes = useStyles();
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

      <div>
        <Box
          height={467}
          width={962}
          border={1}
          bgcolor="#DEE6F0"
          borderColor="#DEE6F0"
          borderRadius={10}
        >
          <div>yo</div>
        </Box>
      </div>

      {/* {expandButton && (
        <div>
          <div className={classes.cardContainer}>
            <div className={classes.cardRow}>
              {assessmentCardsData.map((cards, i) => (
                <div>yo</div>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
