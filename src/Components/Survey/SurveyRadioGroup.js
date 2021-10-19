import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from '@material-ui/core/styles';

export default function SurveyRadioGroup(props) {
  const { questionName, surveyResponses } = props;

  const useStyles = makeStyles(() =>
    createStyles({
      root: {
        display: 'flex',
        flexWrap: 'wrap',
      },

      radioColor: {
        color: '#386EDA',
        '&.Mui-checked': {
          color: '#386EDA',
        },
      },
      radioColumn: {
        display: 'flex',
        flexDirection: 'column',
      },
    })
  );
  const classes = useStyles();

  return (
    <div>
      <div>{questionName}</div>
      <Box mt={2} />
      {surveyResponses.map((questions, i) => (
        <div className={classes.radioColumn}>
          <FormControlLabel
            key={i}
            label={questions.indicator}
            control={<Radio className={classes.radioColor} />}
          />
        </div>
      ))}
    </div>
  );
}
