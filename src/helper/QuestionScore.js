const QuestionTypes = {
  checkbox: 'checkbox',
  radiogroup: 'radiogroup',
  slider: 'nouislider',
};
/**
 * Function calculates the score and max score of a question.
 */
function calculateQuestionScore(question, selectedChoices, riskWeight) {
  var scores = question.score;
  var questionScore = 0;
  var maxQuestionScore = 0;
  if (question.type === QuestionTypes.checkbox) {
    if (selectedChoices !== undefined && Array.isArray(selectedChoices)) {
      selectedChoices.map((choice) => {
        let choiceScore = scores?.choices[choice] ?? 0;
        questionScore += choiceScore;
        if (choiceScore > 0) {
          maxQuestionScore += choiceScore;
        }
        return questionScore;
      });
    }
  } else if (question.type === QuestionTypes.radiogroup) {
    Object.entries(scores.choices).map((choice) => {
      if (selectedChoices !== undefined) {
        if (choice[0] === selectedChoices) {
          questionScore += choice[1];
        }
      }
      if (choice[1] > maxQuestionScore) {
        maxQuestionScore = choice[1];
      }
      return questionScore;
    });
  } else if (question.type === QuestionTypes.slider) {
    maxQuestionScore += scores.max;

    // Map slider results
    // <25 = Low(-1), 25-74 = Medium(0), >75 = High(1)
    if (selectedChoices !== undefined && !Number.isNaN(selectedChoices)) {
      if (selectedChoices < 33) {
        questionScore = question.choices[0] * scores.weight;
      } else if (selectedChoices >= 66) {
        questionScore = question.choices[2] * scores.weight;
      } else {
        questionScore = question.choices[1] * scores.weight;
      }
    }
  }

  // Multiple each questions score by their risk
  return {
    score: questionScore * riskWeight,
    maxScore: maxQuestionScore * riskWeight,
  };
}

function calculateSubdimensionScore(allQuestions, surveyResults, subDimension) {
  var riskScore = 0;
  var mitigationScore = 0;
  var organizationScore = 0;

  // Calculate total risk based off user responses
  allQuestions
    .filter((question) => question.subDimension === subDimension.subDimensionID)
    .map((question) => {
      //console.log(question)
      let selectedChoices = surveyResults[question.name];
      let questionScore = calculateQuestionScore(question, selectedChoices, 1);
      if (question.questionType === 'risk') {
        riskScore += questionScore.score;
      } else if (question.questionType === 'mitigation') {
        mitigationScore += questionScore.score;
      } else if (question.questionType === 'organization') {
        organizationScore += questionScore.score;
      }

      return true;
    });
  //console.log(riskScore)
  //console.log(mitigationScore)
  if (organizationScore) {
    return {
      subDimensionID: subDimension.subDimensionID,
      subDimensionID: subDimension.name,
      dimensionID: subDimension.dimensionID,
      riskScore: riskScore,
      mitigationScore: mitigationScore,
      organizationScore: organizationScore,
    };
  } else {
    return {
      subDimensionID: subDimension.subDimensionID,
      subDimensionID: subDimension.name,
      dimensionID: subDimension.dimensionID,
      riskScore: riskScore,
      mitigationScore: mitigationScore,
    };
  }
}

function calculateOrganization(organizationScore, bonusSettings) {
  console.log(bonusSettings);
  for (let bonus in bonusSettings) {
    let floor = bonusSettings[bonus].floor;
    let ceil = bonusSettings[bonus].ceil;
    //console.log(bonusSettings[bonus])
    if (organizationScore >= floor && organizationScore <= ceil) {
      //console.log(bonusSettings[bonus].bonus)
      return {
        bonus: bonusSettings[bonus].bonus,
        label: bonus,
      };
    }
  }
  return { bonus: 0, label: 'N/A' };
}

function calculateRiskLevel(riskScore, lowerBound, upperBound) {
  if (riskScore > upperBound) {
    return 'High';
  } else if (riskScore < lowerBound) {
    return 'Low';
  } else {
    return 'Medium';
  }
}

function calculateCertification(mitigationScore, riskLevel, certSettings) {
  if (certSettings) {
    let mitigationRequired = certSettings[riskLevel];
    for (let mitigation in mitigationRequired) {
      if (mitigationScore > mitigationRequired[mitigation]) {
        return mitigation;
      }
    }
  }
}

export default {
  calculateQuestionScore: (question, selectedChoices, riskWeight) =>
    calculateQuestionScore(question, selectedChoices, riskWeight),
  calculateSubdimensionScore: (allQuestions, surveyResults, subDimension) =>
    calculateSubdimensionScore(allQuestions, surveyResults, subDimension),
  calculateOrganization: (organizationScore, bonusSettings) =>
    calculateOrganization(organizationScore, bonusSettings),
  calculateRiskLevel: (riskScore, lowerBound, upperBound) =>
    calculateRiskLevel(riskScore, lowerBound, upperBound),
  calculateCertification: (mitigationScore, riskLevel, certSettings) =>
    calculateCertification(mitigationScore, riskLevel, certSettings),
};
