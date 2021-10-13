import React, { useState } from 'react';

import SurveyInput from './SurveyInput';
import SurveyRadioGroup from './SurveyRadioGroup';
import SurveyDropDown from './SurveyDropDown';

export default function Survey(props) {
  const { questionName, responseType, surveyResponses } = props;

  return (
    <div>
      {responseType === 'comment' && (
        <SurveyInput questionName={questionName}></SurveyInput>
      )}
      {responseType === 'radiogroup' && (
        <SurveyRadioGroup
          questionName={questionName}
          surveyResponses={surveyResponses}
        />
      )}
      {responseType === 'dropdown' && (
        <SurveyDropDown questionName={questionName} />
      )}
    </div>
  );
}
