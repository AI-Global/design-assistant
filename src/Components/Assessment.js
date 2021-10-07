import React from 'react';
import Box from '@material-ui/core/Box';
import assessmentsData from '../assets/data/assessmentData.json';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import { ExpandButton, useStyles } from './AssessmentStyle';

export default function Assessment(props) {
  const img = new Image();
  const leftArrow = (img.src = '../img/leftArrow.png');
  const rightArrow = (img.src = '../img/rightArrow.png');

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
      {expandButton && (
        <div className={classes.assessmentContainer}>
          <div className={classes.assessmentCardContainer}>
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {activeStep === 1 && <img src={leftArrow} />}
            </Button>
            <Box
              height={600}
              width={962}
              border={1}
              bgcolor="#F0F0F0"
              borderColor="#F0F0F0"
              borderRadius={10}
            >
              <div className={classes.assessmentColumn}>
                <h1>{assessmentsData[activeStep].title}</h1>
                <Box mt={5} />

                <img
                  className={classes.assessmentImages}
                  src={assessmentsData[activeStep].img}
                ></img>
              </div>
            </Box>

            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === 1}
            >
              {activeStep === 0 && <img src={rightArrow} />}
            </Button>
          </div>
          <Box mt={6} />
          <div className={classes.stepperColumn}></div>
          <Box mt={4} />
        </div>
      )}
    </div>
  );
}
