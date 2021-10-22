import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles } from '@material-ui/core/styles';

export default function SurveyComment(props) {
  const { questionName, questionId, value, updateAnswer } = props;

  const useStyles = makeStyles(() =>
    createStyles({
      inputStyle: {
        width: '80%',
        border: '1px solid #C9D7E9',
        boxSizing: 'border-box',
        borderRadius: '8px',
      },
    })
  );

  const [deleteSubmissions, setDeleteSubmissions] = useState(false);
  const classes = useStyles();

  return (
    <TextField
      className={classes.inputStyle}
      variant="outlined"
      multiline
      label={questionName}
      defaultValue=""
      value={value}
      onChange={(event) => updateAnswer(questionId, event.target.value)}
    ></TextField>
  );
}
