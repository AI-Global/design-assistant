import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

export default function SurveyComment(props) {
  const { questionName } = props;

  const SurveyCommentField = withStyles(() => ({
    root: {
      width: '100%',
      border: '1px solid #C9D7E9',
      boxSizing: 'border-box',
      borderRadius: '8px',
    },
  }))(TextField);

  const [deleteSubmissions, setDeleteSubmissions] = useState(false);

  return (
    <SurveyCommentField
      variant="outlined"
      multiline
      label={questionName}
      defaultValue=""
    ></SurveyCommentField>
  );
}
