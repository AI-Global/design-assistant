import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import calculateQuestionScore from '../helper/QuestionScore';



/**
 * Component renders a HTML Table row for a dimension which 
 * calculates the score of the questions answered for
 * a specific dimension and displays it in a HTML table row.
 */
export default class DimensionScore extends Component {
    
    render() {
        var radarChartData = this.props.radarChartData;
        var dimensionName = this.props.dimensionName;
        var results = this.props.results;
        var questions = this.props.questions;
        var riskWeight = this.props.riskWeight ?? 1;

        var dimensionScore = 0;
        var maxDimensionScore = 0;
        questions.map(question => {
            let selectedChoices = results[question.name];
            let questionScore = calculateQuestionScore(question, selectedChoices, riskWeight);
            dimensionScore += questionScore.score;
            maxDimensionScore += questionScore.maxScore;
            return dimensionScore;
        });
        if (dimensionScore < 0) {
            dimensionScore = 0;
        }
        var percentageScore = (dimensionScore / maxDimensionScore) * 100;
        radarChartData.push({ "dimension": dimensionName, "score": percentageScore?.toFixed(2) });
        return (
            <tr key={dimensionName}>
                <th scope="row" className="score-card-dimensions">{dimensionName}</th>
                <td className="text-center">
                    {(percentageScore < 50)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" aria-label="improve true" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" aria-label="improve false" />
                    }

                </td>
                <td className="text-center">
                    {(percentageScore >= 50 && percentageScore <= 75)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" aria-label="acceptable true" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" aria-label="acceptable false" />
                    }
                </td>
                <td className="text-center">
                    {(percentageScore > 75)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" aria-label="proficient true" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" aria-label="proficient false" />
                    }
                </td>
            </tr>
        )
    }
}
