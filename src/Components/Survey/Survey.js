import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import SurveyInput from './SurveyInput';
import SurveyRadioGroup from './SurveyRadioGroup';
import SurveyDropDown from './SurveyDropDown';
import SurveyCheckBox from './SurveyCheckBox';
import SurveyComment from './SurveyComment';
import TextField from '@material-ui/core/TextField';

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
          key={questionId}
          questionName={questionName}
          questionNumber={questionNumber}
          questionId={questionId}
          updateAnswer={updateAnswer}
          value={value}
        ></SurveyInput>
      )}

      {responseType === 'radiogroup' && (
        <SurveyRadioGroup
          key={questionId}
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
          key={questionId}
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
          key={questionId}
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
          key={questionId}
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
