import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';


const QuestionTypes = 
{
    checkbox: "checkbox",
    radiogroup: "radiogroup"
}

/**
 * Component renders a HTML Table row for a dimension which 
 * calculates the score of the questions answered for
 * a specific dimension and displays it in a HTML table row.
 */
export default class DimensionScore extends Component {
    /**
     * Function calculates the score and max score of a question.
     */
    calculateQuestionScore(question, selectedChoices){
        var scores = question.score;
        var questionScore = 0;
        var maxQuestionScore = 0;
        if(question.type === QuestionTypes.checkbox){
            maxQuestionScore += scores.max;
            if(selectedChoices !== undefined){
                var choiceScore = 0
                selectedChoices.map(choice => {
                    choiceScore += scores?.choices[choice] ?? 0;
                    return choiceScore;
                })
                if(choiceScore > scores.max){
                    choiceScore = scores.max;
                }
                questionScore += choiceScore;
            }
        }
        else if(question.type === QuestionTypes.radiogroup){
            Object.entries(scores.choices).map(choice => {
                if(selectedChoices !== undefined){
                    if(choice[0] === selectedChoices){
                        questionScore += choice[1];
                    }
                }
                if(choice[1] > maxQuestionScore){
                    maxQuestionScore = choice[1];
                }
                return questionScore;
            });
        }
        return {score: questionScore, maxScore: maxQuestionScore};
    }
    render() {
        var radarChartData = this.props.radarChartData;
        var dimensionName = this.props.dimensionName;
        var results = this.props.results;
        var questions = this.props.questions;
        var dimensionScore = 0;
        var maxDimensionScore = 0;
        questions.map(question => {
            let selectedChoices = results[question.name];
            let questionScore = this.calculateQuestionScore(question, selectedChoices);
            dimensionScore += questionScore.score;
            maxDimensionScore += questionScore.maxScore;
            return dimensionScore;
        });
        if(dimensionScore < 0){
            dimensionScore = 0;
        }
        var percentageScore = (dimensionScore/maxDimensionScore)*100;
        radarChartData.push({"dimension": dimensionName, "score": percentageScore?.toFixed(2)});
        return (
            <tr key={dimensionName}>
                <th scope="row" className="score-card-dimensions">{dimensionName}</th>
                <td className="text-center">
                    {(percentageScore < 50) 
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" title="improve true"/>
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" title="improve false"/>
                    }
                    
                </td>
                <td className="text-center">
                    {(percentageScore >= 50 && percentageScore <= 75)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" title="acceptable true"/>
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" title="acceptable false"/>
                    }       
                </td>
                <td className="text-center">
                    {(percentageScore > 75)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" title="proficient true"/>
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" title="proficient false"/>
                    }
                </td>
            </tr>
        )
    }
}
