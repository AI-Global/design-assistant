import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

export default function SurveyCheckBox(props) {
  const {
    questionName,
    surveyResponses,
    questionId,
    value,
    updateAnswer,
  } = props;

  const useStyles = makeStyles(() =>
    createStyles({
      root: {
        display: 'flex',
        flexWrap: 'wrap',
      },

      checkBoxColor: {
        color: '#386EDA',
        '&.Mui-checked': {
          color: '#386EDA',
        },
      },
    })
  );
  const classes = useStyles();
  console.log(value);
  return (
    <div>
      <div>{questionName}</div>
      <Box mt={2} />
      {surveyResponses.map((questions, i) => (
        <div>
          <FormControlLabel
            key={i}
            label={questions.indicator}
            control={
              <Checkbox
                value={value}
                onChange={(event) =>
                  updateAnswer(questionId, event.target.value)
                }
                className={classes.checkBoxColor}
              />
            }
          />
        </div>
      ))}
    </div>
  );
}
