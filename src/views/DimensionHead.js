import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap';

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

export const DimensionHead = ({ dimension }) => {
  return (
    <>
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
                style={{ width: '20%' }}
                className="certification-headers"
              >
                {dimension?.name}
              </th>
              <th
                role="columnheader"
                scope="col"
                style={{ width: '40%' }}
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
            <tr>
              <td>{dimension?.description}</td>
              <td>Risk Score Bar Legend</td>
              <td>Mtigation Score Legend</td>
            </tr>
            <tr>
              <td><strong>Total score:</strong></td>
              <td>Risk Score Bar</td>
              <td>Mtigation Score Bar</td>
            </tr>
            {/* {questions.map((question) => {
              return displayQuestion(results[question?.name], question);
            })} */}
          </tbody>
        </Table>
      </div>
    </>
  )
}

DimensionHead.propTypes = {
  dimension: PropTypes.object.isRequired,
}


