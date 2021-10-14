import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

export default function SurveyInput(props) {
  const { questionName, questionNumber } = props;

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
    <SurveyInputField
      variant="outlined"
      label={questionName}
      defaultValue=""
    ></SurveyInputField>
  );
}
