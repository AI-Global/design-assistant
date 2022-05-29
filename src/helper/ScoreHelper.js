// Compute Scores
//


export const computeDimensionScores = (dimensions, subDimensions, questions, results) => {
  const dimensionScores = dimensions.map(d => {
    const subDimensionsList = subDimensions.filter(sd => sd.dimensionID === d.dimensionID);
    const subDimensionScores = computeSubdimesionScores(subDimensionsList, questions, results);
    const dimensionScore = computeDimensionScore(subDimensionScores);
    return { dimension: d, ...dimensionScore };
  });
  return dimensionScores;
}

export const computeDimensionScore = (subDimensionScores) => {
  let acc = { earned: 0, available: 0 };
  const dimensionScore = subDimensionScores.reduce((acc, curr) => {
    return { earned: acc.earned + curr.earned, available: acc.available + curr.available };
  }, acc);
  return dimensionScore;
}

export const computeSubdimesionScores = (subDimensions, questions, results) => {
  const subDimensionsScores = subDimensions.map(sd => {
    const subDimensionScore = computeSubdimensionScore(sd, questions, results);
    return subDimensionScore;
  });
  return subDimensionsScores;
}

export const computeSubdimensionScore = (subDimension, questions, results) => {
  const sdQuestions = questions?.filter(q => {
    return (q.subDimension === subDimension.subDimensionID)
  });
  const questionScores = computeQuestionScores(sdQuestions, results);
  let acc = { earned: 0, available: 0 };
  const subDimensionScore = questionScores?.reduce((acc, curr) => {
    return { earned: acc.earned + curr.earned, available: acc.available + curr.available };
  }, acc);
  return subDimensionScore;
}

export const computeQuestionScores = (questions, results) => {
  const questionScores = questions?.map(q => {
    const questionScore = computeQuestionScore(q, results[q._id]);
    return questionScore;
  });
  return questionScores;
}

/** Compute question Score from the question responses */
export const computeQuestionScore = (question, answer) => {
  let retval = { available: 0, earned: 0 };
  if (answer) {
    // Answer is a reference to a single response (dropdown)
    if (typeof answer === 'string' && answer.match(/^[0-9a-fA-F]{24}$/)) {
      const [parsedAnswer] = question.responses.filter(r => r._id === answer);
      const available = question.responses.reduce((max, r) => Math.max(max, r.score), 0);
      retval = { available: available || 0, earned: parsedAnswer.score | 0 }
    } else if (Array.isArray(answer)) {  // Answer is an array of responses (checkbox)
      const parsedAnswers = question.responses.filter(r => answer.includes(r._id)).map(pa => pa.indicator);
      const available = question.responses.reduce((max, r) => Math.max(max, r.score), 0);
      const earned = parsedAnswers.reduce((sum, pa) => sum + (pa.score || 0), 0);
      retval = { available: available || 0, earned: earned || 0 }
    } else { // Answer is a number (slider)
      // TODO: Handle slider answers
      retval = { available: 0, earned: 0 }
    }
  }
  return retval;
};





