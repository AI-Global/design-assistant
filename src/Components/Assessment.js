import React from 'react';
import Box from '@material-ui/core/Box';
import assessmentsData from '../assets/data/assessmentData.json';
import { useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import { ExpandButton, AssessmentButton, useStyles } from './AssessmentStyle';

export default function Assessment(props) {
  const img = new Image();
  const leftArrow = (img.src = '../img/leftArrow.png');
  const rightArrow = (img.src = '../img/rightArrow.png');
  const user1 = (img.src = '../img/user1.png');
  const user2 = (img.src = '../img/user2.png');

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
          What do Assessments Cover?
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
              {theme.direction === 'rtl' ? (
                <img src={rightArrow} />
              ) : (
                <img src={leftArrow} />
              )}
            </Button>
            <Box
              height={467}
              width={962}
              border={1}
              bgcolor="#DEE6F0"
              borderColor="#DEE6F0"
              borderRadius={10}
            >
              {activeStep < 5 ? (
                <div className={classes.assessmentColumn}>
                  <img src={assessmentsData[activeStep].img}></img>

                  <h1>{assessmentsData[activeStep].title}</h1>
                  <div style={{ width: '80%', paddingTop: 20 }}>
                    <h3>{assessmentsData[activeStep].description}</h3>
                  </div>
                  <Box mt={15} />
                </div>
              ) : (
                <div className={classes.peopleContainer}>
                  <div className={classes.peopleRow}>
                    <div className={classes.peopleColumn}>
                      <h3>{assessmentsData[activeStep].title}</h3>
                      <Box mt={5} />
                      <img src={user1} />
                    </div>
                    <div className={classes.peopleColumn}>
                      <h3>{assessmentsData[activeStep].description}</h3>

                      <img src={user2} />
                    </div>
                  </div>
                </div>
              )}
            </Box>

            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === 5}
            >
              {theme.direction === 'rtl' ? (
                <img src={leftArrow} />
              ) : (
                <img src={rightArrow} />
              )}
            </Button>
          </div>
          <Box mt={6} />
          <div className={classes.stepperColumn}>
            <MobileStepper
              variant="dots"
              steps={6}
              position="static"
              className={classes.stepperBackgroundColor}
              activeStep={activeStep}
              sx={{ maxWidth: 400, flexGrow: 1 }}
            />
          </div>
          <Box mt={4} />
        </div>
      )}
    </div>
  );
}
