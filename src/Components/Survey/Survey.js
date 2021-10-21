import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import SurveyInput from './SurveyInput';
import SurveyRadioGroup from './SurveyRadioGroup';
import SurveyDropDown from './SurveyDropDown';
import SurveyCheckBox from './SurveyCheckBox';
import SurveyComment from './SurveyComment';

export default function SurveyTest(props) {
  const {
    questionName,
    responseType,
    surveyResponses,
    questionNumber,
    questionId,
    updateAnswer,
    value,
  } = props;

  return (
    <div>
      {responseType === 'text' && (
        <SurveyInput
          questionName={questionName}
          questionNumber={questionNumber}
          questionId={questionId}
          updateAnswer={updateAnswer}
          value={value}
        ></SurveyInput>
      )}

      {responseType === 'radiogroup' && (
        <SurveyRadioGroup
          questionName={questionName}
          surveyResponses={surveyResponses}
          questionNumber={questionNumber}
          questionId={questionId}
          updateAnswer={updateAnswer}
          value={value}
        />
      )}

      {responseType === 'dropdown' && (
        <SurveyDropDown
          questionName={questionName}
          surveyResponses={surveyResponses}
          questionNumber={questionNumber}
          questionId={questionId}
          updateAnswer={updateAnswer}
          value={value}
        />
      )}

      {responseType === 'checkbox' && (
        <SurveyCheckBox
          questionName={questionName}
          surveyResponses={surveyResponses}
          questionNumber={questionNumber}
          questionId={questionId}
          updateAnswer={updateAnswer}
          value={value}
        />
      )}
      <Box mt={8} />
      {responseType === 'comment' && (
        <SurveyComment
          questionName={questionName}
          surveyResponses={surveyResponses}
          questionNumber={questionNumber}
          questionId={questionId}
          updateAnswer={updateAnswer}
          value={value}
        />
      )}
      <Box mt={8} />
    </div>
  );
}
