import React, { Component } from 'react';
import {Table} from 'react-bootstrap'

/**
 * Class renders a HTML Table of a report card.
 * Table provides a list of the questions answered, the user's responses
 * and the recommendations provided by AI Global for a specific dimension.
 */
export default class ReportCard extends Component{
    /**
     * Function creates the HTML for a row of the report card table which
     * provides the question, the response to the question,
     * and the recommendation from AI Global.
     * @param result 
     * @param question 
     * @returns HTML row to be displayed in the report card table.
     */
    displayQuestion(result, question){     
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
    
    render (){
        var dimension = this.props.dimension;
        var results = this.props.results;
        var questions = this.props.questions;
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
                            return this.displayQuestion(results[question?.name], question)
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}   

