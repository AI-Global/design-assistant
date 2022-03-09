import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap';
import { DimensionHead } from './DimensionHead'


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
export default function Certification({ dimension, results, questions }) {
  return (
    <>
      <DimensionHead dimension={dimension} />
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
                {dimension?.name}
              </th>
              <th
                role="columnheader"
                scope="col"
                className="certification-headers"
              >
                Risk Scores
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
            {questions.map((question) => {
              return displayQuestion(results[question?.name], question);
            })}
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
