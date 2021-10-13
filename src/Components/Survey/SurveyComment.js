import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';

export default function SurveyComment(props) {
  const { questionName } = props;

  const [deleteSubmissions, setDeleteSubmissions] = useState(false);

  return (
    <TextField
      variant="outlined"
      required
      multiline
      label="Required"
      defaultValue={questionName}
    ></TextField>
  );
}
