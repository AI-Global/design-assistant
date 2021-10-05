import React from 'react';
import Box from '@material-ui/core/Box';
import assessmentCardsData from '../assets/data/assessmentCardData.json';
import { useTheme } from '@material-ui/core/styles';

import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { ExpandButton, AssessmentButton, useStyles } from './AssessmentStyle';

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '60%',
          }}
        >
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
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
            <div className={classes.column}>
              <h1>{assessmentCardsData[activeStep].title}</h1>
              <div style={{ width: '80%', paddingTop: 20 }}>
                <h3>{assessmentCardsData[activeStep].description}</h3>
              </div>
              <Box mt={6} />
              <div className={classes.chipContainer}>
                <div className={classes.chipRow}>
                  <AssessmentButton>Data</AssessmentButton>
                  <AssessmentButton>Model</AssessmentButton>
                  <AssessmentButton>Context</AssessmentButton>
                </div>
              </div>
            </div>
          </Box>

          <Button size="small" onClick={handleNext} disabled={activeStep === 4}>
            {theme.direction === 'rtl' ? (
              <img src={leftArrow} />
            ) : (
              <img src={rightArrow} />
            )}
          </Button>
        </div>
      </div>
      <Box mt={6} />
      <div className={classes.column}>
        <MobileStepper
          variant="dots"
          steps={5}
          position="static"
          className={classes.stepperBackgroundColor}
          activeStep={activeStep}
          sx={{ maxWidth: 400, flexGrow: 1 }}
        />
      </div>
      <Box mt={6} />

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
