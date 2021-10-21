import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles } from '@material-ui/core/styles';

export default function SurveyInput(props) {
  const { questionName, questionId, value, updateAnswer } = props;

  const useStyles = makeStyles(() =>
    createStyles({
      inputStyle: {
        width: '80%',
        height: '100px',
        border: '1px solid #C9D7E9',
        boxSizing: 'border-box',
        borderRadius: '8px',
      },
    })
  );

  const [deleteSubmissions, setDeleteSubmissions] = useState(false);
  const classes = useStyles();

  console.log(value);
  return (
    <div>
      <div>{questionName}</div>
      <Box mt={2} />
      <TextField
        className={classes.inputStyle}
        id="tyler"
        name="tyler"
        value={value}
        onChange={(event) => updateAnswer(questionId, event.target.value)}
      ></TextField>
    </div>
  );
}
