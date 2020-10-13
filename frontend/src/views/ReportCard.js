import React from 'react';
import {Table} from 'react-bootstrap'
import "../css/results.css"

function displayQuestion(result, question){     
    var choices = question?.choices?.filter((choice) => result.includes(choice?.value));     
    return (
        <tr key={question?.name}>
            <td>
                {question?.title?.default.split("\n").map(function(item, idx) {
                    return (
                        <span key={idx}>
                            {item}
                            <br/>
                        </span>
                    )
                })}
            </td>
            <td>
                {choices.map(choice => {
                    return (
                        choice?.text?.default.split("\n").map(function(item, idx) {
                            return (
                                <span key={idx}>
                                    {item}
                                    <br/>
                                </span>
                            )
                        })
                    )
                })}
            </td>
            <td>
                {question?.recommendation?.default.split("\n").map(function(item, idx) {
                    return (
                        <span key={idx}>
                            {item}
                            <br/>
                        </span>
                    )
                })}
            </td>
        </tr>
    )
}

export function createReportCard(dimension, results, questions){
    return (
        <div className="report-card mt-3">
            <Table id={"report-card-"+ dimension} bordered responsive className="report-card-table">
                <thead>
                    <tr role="row">
                        <th role="columnheader" scope="col" className="report-card-headers">
                            <div>
                                Question
                            </div>
                        </th>
                        <th role="columnheader" scope="col" className="report-card-headers">
                            <div>
                                Your Response
                            </div>
                        </th>
                        <th role="columnheader" scope="col" className="report-card-headers">
                            <div>
                                Recommendation
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map(question => {
                        return displayQuestion(results[question?.name], question)
                    })}
                </tbody>
            </Table>
        </div>
    );
}   

export default createReportCard;