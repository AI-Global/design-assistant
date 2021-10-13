import React, { useState } from 'react';

import SurveyInput from './SurveyInput';
import SurveyRadioGroup from './SurveyRadioGroup';
import SurveyDropDown from './SurveyDropDown';
import SurveyCheckBox from './SurveyCheckBox';
import SurveyComment from './SurveyComment';

export default function Survey(props) {
  const { questionName, responseType, surveyResponses } = props;

  return (
    <div>
      {responseType === 'text' && (
        <SurveyInput questionName={questionName}></SurveyInput>
      )}
      {responseType === 'radiogroup' && (
        <SurveyRadioGroup
          questionName={questionName}
          surveyResponses={surveyResponses}
        />
      )}
      {responseType === 'dropdown' && (
        <SurveyDropDown
          questionName={questionName}
          surveyResponses={surveyResponses}
        />
      )}
      {responseType === 'checkbox' && (
        <SurveyCheckBox
          questionName={questionName}
          surveyResponses={surveyResponses}
        />
      )}
      {responseType === 'comment' && (
        <SurveyComment
          questionName={questionName}
          surveyResponses={surveyResponses}
        />
      )}
    </div>
  );
}
