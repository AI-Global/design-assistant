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

export default calculateQuestionScore;
