import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap';
import { ScoreBar } from '../Components/ScoreBar';
import calculateQuestionScore from '../helper/QuestionScore';
import riskScoreLegend from '../assets/svg/risk-legend.svg';
import { Typography } from '@material-ui/core';
import mitigationScoreLegend from '../assets/svg/mitigation-legend.svg';

const displayDimension = (result, question) => {
  var choices;
  if (Array.isArray(result)) {
    choices = question?.choices?.filter((choice) =>
      result?.includes(choice?.value)
    );
  } else {
    choices = question?.choices?.filter((choice) => result === choice?.value);
  }
  console.log('question', question)
  console.log('result', result)
  console.log('choices', choices)

  return (
    <tr key={question?.name}>
      <td>
        {question?.title?.default.split('\n').map(function (item, idx) {
          return (
            <span key={idx}>
              {item}
              <br />
            </span>
          );
        })}
      </td>
      <td>
        {question?.recommendation?.default
          .split('\n')
          .map((item, idx) => {
            return (
              <span key={idx}>
                {item}
                <br />
              </span>
            );
          })}
      </td>
      <td>
        {question?.recommendedlinks?.default.map(function (
          recommendedlink,
          idx
        ) {
          let url = recommendedlink;
          if (!/^(?:f|ht)tps?:\/\//.test(url)) {
            url = 'http://' + url;
          }
          return (
            <span key={idx}>
              <a href={url}>{recommendedlink}</a>
              <br />
            </span>
          );
        })}
      </td>
    </tr>
  );
}

export const DimensionHead = ({ dimension, questions, results, riskWeight = 1 }) => {
  var dimensionScore = 0;
  var maxDimensionScore = 0;
  questions.map((question) => {
    let selectedChoices = results[question.name];
    let questionScore = calculateQuestionScore(
      question,
      selectedChoices,
      riskWeight
    );
    dimensionScore += questionScore.score;
    maxDimensionScore += questionScore.maxScore;
    return dimensionScore;
  });
  if (dimensionScore < 0) {
    dimensionScore = 0;
  }
  var percentageScore = (dimensionScore / maxDimensionScore) * 100;
  return (
    <>
      <div className="certification mt-3">
        <div style={{
          borderBottom: '1px solid #000000',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: '#000000',
          marginBottom: '1em',
          marginTop: '1em',
          paddingBottom: '0.2em',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px'
        }}>
          <p style={{
            fontSize: '32px',
            fontWeight: 700,
          }}>
            {dimension?.name}
          </p>
        </div>
        <p style={{ fontWeight: 'bold', lineHeight: '16px' }}>
          Description
        </p>
        <p>{dimension?.description}</p>
        <p style={{
          fontWeight: 'bold',
          fontSize: '24px',
          lineHeight: '32px',
          marginTop: '18px',
        }}>
          Sub-Dimension
        </p>
      </div>
    </>
  )
}

DimensionHead.propTypes = {
  dimension: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  results: PropTypes.object.isRequired,
}


