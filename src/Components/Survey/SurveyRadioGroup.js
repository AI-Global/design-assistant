import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { RadioGroup } from '@material-ui/core';

export default function SurveyRadioGroup(props) {
  const { questionName, surveyResponses, questionId, value, updateAnswer } = props;

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
      <RadioGroup
        value={value}
      >
        {surveyResponses.map((questions, i) => (
          <div key={questionId} className={classes.radioColumn}>
            <FormControlLabel
              key={questionId}
              label={questions.indicator}
              control={<Radio className={classes.radioColor} />}
              onChange={(event) => { console.log(event); updateAnswer(questionId, event.target.value) }}
              value={questions._id}
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
