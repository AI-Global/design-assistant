import React, { useState } from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

export default function SurveyRadioGroup(props) {
  const { questionName, surveyResponses } = props;

  return (
    <div>
      <div>{questionName}</div>
      {surveyResponses.map((questions, i) => (
        <RadioGroup>
          <FormControlLabel
            key={i}
            label={questions.indicator}
            control={<Radio />}
          />
        </RadioGroup>
      ))}
    </div>
  );
}
