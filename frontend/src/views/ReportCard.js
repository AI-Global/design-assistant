import React, { Component } from 'react';
import {Table} from 'react-bootstrap';

/**
 * Component renders a Table for the report card.
 * Table provides a list of the questions answered, the user's responses
 * and the recommendations provided by AI Global for a specific dimension.
 */
export default class ReportCard extends Component{
    /**
     * Function creates the  row of the report card table which
     * provides the question, the response to the question,
     * and the recommendation from AI Global.
     */
    displayQuestion(result, question){    
        var choices;
        if(Array.isArray(result)){
            choices = question?.choices?.filter((choice) => result?.includes(choice?.value) );     
        }
        else{
            choices = question?.choices?.filter((choice) => result === choice?.value );     
        }
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
                                    Question
                            </th>
                            <th role="columnheader" scope="col" className="report-card-headers">
                                    Your Response
                            </th>
                            <th role="columnheader" scope="col"  style={{width: 370}} className="report-card-headers">
                                    Recommendation
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

