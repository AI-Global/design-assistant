import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

export default function SurveyDropDown(props) {
  const { questionName } = props;

  const [deleteSubmissions, setDeleteSubmissions] = useState(false);

  return (
    <div>
      <InputLabel id="demo-multiple-name-label">{questionName}</InputLabel>
      {/* <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        value={'yo'}
        // onChange={handleChange}
        input={<OutlinedInput label="Name" />}
        // MenuProps={MenuProps}
      > */}
      <MenuItem />
      {/* {names.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, personName, theme)}
          >
            {name}
          </MenuItem>
        ))} */}
      {/* </Select> */}
    </div>
  );
}
