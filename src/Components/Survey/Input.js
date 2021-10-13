import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';

export default function Input(props) {
  const { questionName } = props;

  const [deleteSubmissions, setDeleteSubmissions] = useState(false);

  return (
    <TextField
      variant="outlined"
      required
      label="Required"
      defaultValue={questionName}
    ></TextField>
  );
}
