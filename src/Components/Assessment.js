import React from 'react';
import Box from '@material-ui/core/Box';
import assessmentsData from '../assets/data/assessmentData.json';
import AssessmentSlider from './AssessmentSlider';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { ExpandButton, useStyles } from './AssessmentStyle';

export default function Assessment(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [expandButton, setExpandButton] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleExpandButton = () => {
    setExpandButton(!expandButton);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <div className={classes.outterContainer}>
        <Box mt={20} />
        <div className={classes.assessmentTitle}>
          {expandButton ? <div></div> : <div>What do Assessments Cover?</div>}
        </div>

        <div className={classes.expandButtonEnd}>
          <ExpandButton onClick={handleExpandButton}>
            {expandButton ? (
              <div>
                Collapse
                <KeyboardArrowUp />
              </div>
            ) : (
              <div>
                Expand
                <KeyboardArrowDown />
              </div>
            )}
          </ExpandButton>
        </div>
      </div>
      {expandButton && <AssessmentSlider expandButton={false} />}
    </div>
  );
}
