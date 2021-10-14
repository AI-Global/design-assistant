import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles, createStyles } from '@material-ui/core/styles';

export default function SurveyCheckBox(props) {
  const { questionName, surveyResponses } = props;

  const useStyles = makeStyles(() =>
    createStyles({
      root: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      checkBoxColumn: {
        display: 'flex',
        flexDirection: 'column',
      },
    })
  );
  const classes = useStyles();

  return (
    <div>
      <div>{questionName}</div>
      {surveyResponses.map((questions, i) => (
        <div className={classes.checkBoxColumn}>
          <FormControlLabel
            key={i}
            label={questions.indicator}
            control={<Checkbox />}
          />
        </div>
      ))}
    </div>
  );
}
