import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function SurveyCheckBox(props) {
  const { questionName, surveyResponses } = props;

  return (
    <div>
      <div>{questionName}</div>
      <Checkbox>
        {surveyResponses.map((questions, i) => (
          <FormControlLabel
            value={questions.indicator}
            control={<Checkbox />}
          />
        ))}
      </Checkbox>
    </div>
  );
}
