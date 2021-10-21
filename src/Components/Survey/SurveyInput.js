import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

export default function SurveyInput(props) {
  const { questionName, questionId, value, updateAnswer } = props;

  const SurveyInputField = withStyles(() => ({
    root: {
      width: '80%',
      border: '1px solid #C9D7E9',
      boxSizing: 'border-box',
      borderRadius: '8px',
    },
  }))(TextField);

  const [deleteSubmissions, setDeleteSubmissions] = useState(false);

  return (
    <div>
      <div>{questionName}</div>
      <Box mt={2} />
      <SurveyInputField
        variant="outlined"
        defaultValue=""
        value={value}
        onChange={(event) => updateAnswer(questionId, event.target.value)}
      ></SurveyInputField>
    </div>
  );
}
