import React, { useState } from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import { QuestionSelectBase } from 'survey-react';

export default function SurveyRadioGroup(props) {
  const { questionName, surveyResponses } = props;

  return (
    <div>
      <div>{questionName}</div>

      <RadioGroup>
        {surveyResponses.map((questions, i) => (
          <FormControlLabel value={questions.indicator} control={<Radio />} />
        ))}
      </RadioGroup>
    </div>
  );
}
