import React, { useState, useEffect } from 'react'
import api from '../api';
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap';
import { DimensionHead } from './DimensionHead'
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import Canvas from '../Components/Canvas';

const displayQuestion = (result, question) => {
  var choices;
  if (Array.isArray(result)) {
    choices = question?.choices?.filter((choice) =>
      result?.includes(choice?.value)
    );
  } else {
    choices = question?.choices?.filter((choice) => result === choice?.value);
  }

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
export default function Certification({ dimension, results, questions, subDimensions, submission }) {
  const [strengthsEditMode, setStrengthsEditMode] = useState(false);
  const [recommendationsEditMode, setRecommendationsEditMode] = useState(false);
  const [questionsData, serQuestionsData] = useState(null);
  const [strengths, setStrengths] = useState('No recommendations yet.');
  const [improvements, setImprovements] = useState('No recommendations yet.');

  useEffect(() => {
    api
      .get(`submissions/submission/${submission?._id}`)
      .then((res) => {
        const submissionFromAPI = res.data.submission;
        if (submissionFromAPI?.recommendations) {
          const [currentRecommendations] = submissionFromAPI?.recommendations?.filter(r => r.dimensionId === dimension.dimensionID);
          setStrengths(currentRecommendations?.strengths?.length > 0 ? currentRecommendations?.strengths : 'No recommendations yet.');
          setImprovements(currentRecommendations?.improvements?.length > 0 ? currentRecommendations?.improvements : 'No recommendations yet.');
        }
      });
    api.get('questions/all').then((res) => {
      serQuestionsData(res.data.questions)
    });
  }, []);

  const saveRecommendations = () => {
    const submissionRecommendations = submission?.recommendations ?? []
    function upsert(item) {
      const i = submissionRecommendations.findIndex(_item => _item.dimensionId === item.dimensionId);
      if (i > -1) submissionRecommendations[i] = item;
      else submissionRecommendations.push(item);
    }
    const updatedRecommendation = {
      dimensionId: dimension.dimensionID,
      strengths,
      improvements,
    };
    upsert(updatedRecommendation);
    if (submission) {
      api.post(`submissions/update/recommendations/${submission?._id}`, {
        recommendations: submissionRecommendations,
      }).then(res => {
        console.log('saved')
      }).catch(e => {
        console.log('error updating submission:', e)
      });
    }
    setStrengthsEditMode(false);
    setRecommendationsEditMode(false);
    console.log('saving this...', strengths, improvements)
  };
  const subDimensionsToDisplay = subDimensions.filter(d => d.dimensionID === dimension.dimensionID);
  return (
    <>
      <DimensionHead dimension={dimension} questions={questions} results={results} />
      {subDimensionsToDisplay.length > 0 && subDimensionsToDisplay.map((sd, index) => {
        const questionsToDisplay = [];
        const sdQuestions = questionsData?.filter(q => q.subDimension === sd.subDimensionID);
        sdQuestions?.map(sdq => {
          const answer = results[sdq._id];
          if (answer) {
            if (typeof answer === 'string' && answer.match(/^[0-9a-fA-F]{24}$/)) {
              const [parsedAnswer] = sdq.responses.filter(r => r._id === answer);
              const maxScore = sdq.responses.reduce((max, r) => Math.max(max, r.score), 0);
              questionsToDisplay.push({
                question: sdq,
                answer: { value: parsedAnswer.indicator, maxScore: maxScore, answerScore: parsedAnswer.score },
              });
            } else if (Array.isArray(answer)) {
              const parsedAnswers = sdq.responses.filter(r => answer.includes(r._id));
              const maxScore = sdq.responses.reduce((max, r) => max + r.score, 0);
              const answerScore = parsedAnswers.reduce((sum, pa) => sum + (pa.score || 0), 0);
              questionsToDisplay.push({
                question: sdq,
                answer: { value: parsedAnswers.map(pa => pa.indicator).join(', '), maxScore, answerScore },
              });
            } else {
              questionsToDisplay.push({
                question: sdq,
                answer: { value: answer }
              });
            }
          }
        });
        return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>{sd.name}</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <div>
                <Typography style={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>
                  Description
                </Typography>
                <Typography style={{ fontSize: '12px', fontWeight: '300' }}>
                  {sd.description}
                </Typography>
              </div>
              <Table
                id={'certification-' + dimension}
                borderless
                responsive
                className="certification-table"
              >
                <thead>
                  <tr>
                    <th>
                      <Typography style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        Question
                      </Typography>
                    </th>
                    <th>
                      <Typography style={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>
                        Your answer
                      </Typography>
                    </th>
                    <th>
                      <Typography style={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>
                        Points Earned
                      </Typography>
                    </th>
                    <th>
                      <Typography style={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>
                        Supporting Documentation
                      </Typography>
                    </th>
                    <th>
                      <Typography style={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>
                        Supporting Links
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {questionsToDisplay.length > 0 ? questionsToDisplay.map((qa, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <Typography style={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>
                            {qa.question.questionNumber} <a href="#">Learn more</a>
                          </Typography>
                          <Typography style={{ fontSize: '12px', fontWeight: '300' }}>
                            {qa.question.question}
                          </Typography>
                        </td>
                        <td>
                          <Typography style={{ fontSize: '12px', fontWeight: '300' }}>
                            {qa?.answer.value}
                          </Typography>
                        </td>
                        <td>
                          <Typography style={{ fontSize: '12px', fontWeight: '300' }}>
                            {qa?.answer.answerScore}/{qa?.answer.maxScore}
                          </Typography>
                        </td>
                        <td>

                          <Typography style={{ fontSize: '12px', fontWeight: '300' }}>
                            {qa.answer.reference || '--'}
                          </Typography>
                        </td>
                        <td>

                          <Typography style={{ fontSize: '12px', fontWeight: '300' }}>
                            --
                          </Typography>
                        </td>
                      </tr>
                    )
                  }) : (
                    <tr>
                      <td>
                        <Typography style={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>
                          No data to display
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </>
  );
}

Certification.propTypes = {
  dimension: PropTypes.object,
  results: PropTypes.object,
  questions: PropTypes.array,
}
