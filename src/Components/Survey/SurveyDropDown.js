import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles, createStyles } from '@material-ui/core/styles';

export default function SurveyDropDown(props) {
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
      inputStyle: {
        width: '50%',
        border: '1px solid #C9D7E9',
        boxSizing: 'border-box',
        borderRadius: '8px',
      },
    })
  );

  const classes = useStyles();

  return (
    <div>
      <InputLabel id="demo-multiple-name-label">{questionName}</InputLabel>
      <Select
        className={classes.inputStyle}
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        label={{ questionName }}
        value={value}
        onChange={(event) => updateAnswer(questionId, event.target.value)}
        input={<OutlinedInput label="Name" />}
      >
        <MenuItem />
        {surveyResponses.map((questions, i) => (
          <MenuItem key={i} value={questions.indicator}>
            {questions.indicator}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
