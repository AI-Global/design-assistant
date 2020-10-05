import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { Tabs, Tab } from 'react-bootstrap'
import "../Themes.css"

export default class Results extends Component {
    render(){
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" class="container" style={{paddingBottom: "1rem"}}>
                <div class="results">
                    <h1 class="section-header">Results</h1>
                </div>
                <Tabs>
                    <Tab eventKey="score" title="Score">
                    <div class="table-responsive">
                            <table id="scoreTable" role="table" class="table b-table score table-bordered">
                                <thead class="">
                                    <tr class="">
                                        <th scope="col" class="">
                                            Dimensions
                                        </th>
                                        <th scope="col" class="">
                                            Needs to improve
                                        </th>
                                        <th scope="col" class="">
                                            Acceptable
                                        </th>
                                        <th scope="col" class="">
                                            Proficient
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="">
                                        <th scope="row" class="">
                                            Accountability
                                        </th>
                                        <td class="text-center">
                                            <i class="fas fa-check-circle"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-circle"/>
                                        </td>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-circle"/>
                                        </td>
                                    </tr>
                                    <tr class="">
                                        <th scope="row" class="">
                                            Explainability
                                        </th>
                                    <td class="text-center">
                                        <i class="far fa-lg fa-check-circle"/>
                                    </td>
                                    <td class="text-center">
                                        <i class="far fa-lg fa-circle">
                                        </i>
                                    </td>
                                    <td class="text-center">
                                        <i class="far fa-lg fa-circle"/>
                                    </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" class="">
                                            Data quality and rights
                                        </th>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-check-circle"/>
                                        </td>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-circle"/>
                                        </td>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-circle"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" class="">
                                            Bias and fairness
                                        </th>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-check-circle"/>
                                        </td>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-circle"/>
                                        </td>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-circle"/>
                                        </td>
                                    </tr>
                                    <tr class="">
                                        <th scope="row" class="">
                                            Robustness
                                        </th>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-check-circle"/>
                                        </td>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-circle"/>
                                        </td>
                                        <td class="text-center">
                                            <i class="far fa-lg fa-circle"/>
                                        </td>
                                    </tr>
                               </tbody>
                            </table>
                        </div>
                    </Tab>
                    <Tab eventKey="report-card" title="Report Card">
                    <div class="table-responsive">
                            <table role="table" class="table b-table report-card table-bordered">
                                <thead role="rowgroup" class="">
                                    <tr role="row" class="">
                                        <th role="columnheader" scope="col" class="">
                                            <div>
                                                Question
                                            </div>
                                        </th>
                                        <th role="columnheader" scope="col" class="">
                                            <div>
                                                Your Response
                                            </div>
                                        </th>
                                        <th role="columnheader" scope="col" class="">
                                            <div>
                                                Recommendation
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody role="rowgroup">
                                </tbody>
                            </table>
                            <Tabs>
                                <Tab eventKey="accountability" title="Accountability">
                                </Tab>
                                <Tab eventKey="explainability" title="Explainability">
                                    
                                </Tab>
                                <Tab eventKey="data-quality" title="Data quality and rights">
                                    
                                </Tab>
                                <Tab eventKey="bias-fairness" title="Bias and fairness">
                                    
                                </Tab>
                                <Tab eventKey="robustness" title="Robustness">
                                    
                                </Tab>
                            </Tabs>
                        </div>
                    </Tab>
                </Tabs>
            </main>
        );
    }
}