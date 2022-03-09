import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap';


const displayQuestion = (result, question) => {
  var choices;
  if (Array.isArray(result)) {
    choices = question?.choices?.filter((choice) =>
      result?.includes(choice?.value)
    );
  } else {
    choices = question?.choices?.filter((choice) => result === choice?.value);
  }
  console.log('choices', choices)
  console.log('question', question)
  console.log('result', result)

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
        {choices.map((choice) => {
          return choice?.text?.default.split('\n').map(function (item, idx) {
            return (
              <span key={idx}>
                {item}
                <br />
              </span>
            );
          });
        })}
      </td>
      <td>
        {question?.recommendation?.default
          .split('\n')
          .map(function (item, idx) {
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
    <div className="certification mt-3">
      <Table
        id={'certification-' + dimension}
        bordered
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
              Question
            </th>
            <th
              role="columnheader"
              scope="col"
              className="certification-headers"
            >
              Your Response
            </th>
            <th
              role="columnheader"
              scope="col"
              className="certification-headers"
            >
              Recommendation
            </th>
            <th
              role="columnheader"
              scope="col"
              style={{ width: 283 }}
              className="certification-headers"
            >
              Recommended Links
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
  );
}

Certification.propTypes = {
  dimension: PropTypes.string,
  results: PropTypes.object,
  questions: PropTypes.array,
}
