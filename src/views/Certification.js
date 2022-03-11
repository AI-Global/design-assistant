import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap';
import { DimensionHead } from './DimensionHead'
import { ScoreBar } from '../Components/ScoreBar';


const displayQuestion = (result, question) => {
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

/**
 * Generate the RAI Certification document from the submission data.
 * @returns {React.Component}
 */
export default function Certification({ dimension, results, questions, subDimensions }) {
  const subDimensionsToDisplay = subDimensions.filter(d => d.dimensionID === dimension.dimensionID);
  return (
    <>
      <DimensionHead dimension={dimension} questions={questions} results={results} />
      <div className="certification mt-3">
        <Table
          id={'certification-' + dimension}
          borderless
          responsive
          className="certification-table"
        >
          <thead>
            <tr role="row">
              <th
                role="columnheader"
                scope="col"
                className="certification-headers"
              >
                {dimension?.name} sub-dimension scores:
              </th>
              <th
                role="columnheader"
                scope="col"
                className="certification-headers"
              >
                Risk Scoressss
              </th>
              <th
                role="columnheader"
                scope="col"
                className="certification-headers"
              >
                Mitigation Scores
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {questions.map((question) => {
              return displayQuestion(results[question?.name], question);
            })} */}
            {subDimensionsToDisplay.length > 0 && subDimensionsToDisplay.map((sd) => (
              <tr>
                <td>
                  <strong>{sd.name}</strong>
                  <p>{sd.description}</p>
                </td>
                <td><ScoreBar score={Math.floor(Math.random() * 101)} palette="risk" /></td>
                <td><ScoreBar score={Math.floor(Math.random() * 101)} palette="mitigation" /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

Certification.propTypes = {
  dimension: PropTypes.object,
  results: PropTypes.object,
  questions: PropTypes.array,
}
