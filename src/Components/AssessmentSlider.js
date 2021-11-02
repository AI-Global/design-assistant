import React from 'react';
import Box from '@material-ui/core/Box';
import assessmentsData from '../assets/data/assessmentData.json';
import { useTheme } from '@material-ui/core/styles';

import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons/';

import { useStyles } from './AssessmentSliderStyle';

export default function Assessment(props) {
  const { expandButton } = props;
  const classes = useStyles();
  const theme = useTheme();

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <div className={classes.assessmentContainer}>
        {activeStep === 1 ? (
          <KeyboardArrowLeft
            className={classes.arrowStyle}
            onClick={handleBack}
            disabled={activeStep === 0}
          />
        ) : (
          <div style={{ width: '5%' }}></div>
        )}
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
        {activeStep === 0 ? (
          <KeyboardArrowRight
            className={classes.arrowStyle}
            onClick={handleNext}
            disabled={activeStep === 1}
            className={classes.arrowStyle}
          />
        ) : (
          <div style={{ width: '5%' }}></div>
        )}
      </div>
      <Box mt={6} />
      <div className={classes.stepperColumn}></div>
      <Box mt={4} />
    </div>
  );
}
