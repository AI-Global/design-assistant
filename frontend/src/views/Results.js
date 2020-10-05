import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { Tabs, Tab, Table, Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircle  } from '@fortawesome/free-regular-svg-icons'


export default class Results extends Component {


      
    render(){
        var unselected = "#dee2e6";
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" class="container" style={{paddingBottom: "1rem"}}>
                <div class="results">
                    <h1 class="section-header">Results</h1>
                </div>
                <Tabs>
                    <Tab eventKey="score" title="Score">
                    <div class="table-responsive mt-3">
                            <Table striped bordered hover responsive> 
                                <thead>
                                    <tr>
                                        <th>
                                            Dimensions
                                        </th>
                                        <th>
                                            Needs to improve
                                        </th>
                                        <th>
                                            Acceptable
                                        </th>
                                        <th>
                                            Proficient
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">
                                            Accountability
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                        </td>
                                    </tr>
                                    <tr class="">
                                        <th scope="row">
                                            Explainability
                                        </th>
                                    <td class="text-center">
                                        <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                    </td>
                                    <td class="text-center">
                                        <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                    </td>
                                    <td class="text-center">
                                        <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                    </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            Data quality and rights
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            Bias and fairness
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                        </td>
                                    </tr>
                                    <tr class="">
                                        <th scope="row">
                                            Robustness
                                        </th>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                        </td>
                                        <td class="text-center">
                                            <FontAwesomeIcon icon={faCircle} size="lg" color={unselected}/>
                                        </td>
                                    </tr>
                               </tbody>
                            </Table>
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
                <p>
                    As‌ ‌AI‌ ‌continues‌ ‌to‌ ‌evolve‌ ‌so‌ ‌will‌ ‌the‌ ‌Design‌ ‌Assistant.‌ ‌
                    We‌ ‌are‌ ‌working‌ ‌now‌ ‌to‌ ‌add‌ questions‌ ‌that‌ ‌are‌ ‌more‌ ‌industry‌ ‌specific‌ ‌and‌ ‌tailored‌ ‌for‌ ‌your‌ ‌location.‌ 
                    ‌To‌ ‌do‌ ‌this,‌ ‌we‌ can‌ ‌use‌ ‌your‌ ‌help!‌ ‌Share‌ ‌with‌ ‌us‌ ‌the‌ ‌results‌ ‌of‌ ‌your‌ ‌report.‌ 
                    ‌Let‌ ‌us‌ ‌know‌ ‌where‌ ‌you‌ ‌need‌ more‌ ‌clarification,‌ ‌and‌ ‌where‌ ‌more‌ ‌guidance‌ ‌might‌ ‌be‌ ‌needed.‌
                     If‌ ‌you‌ ‌weren’t‌ ‌ready‌ ‌to‌ ‌answer‌ ‌all‌ ‌of‌ ‌the‌ ‌questions‌ ‌today,‌ ‌that’s‌ ‌ok,‌ ‌save‌ ‌your‌ ‌report,‌ ‌and‌ you‌ ‌can‌ ‌reload‌ ‌it‌ ‌the‌ ‌next‌ ‌time‌ ‌you‌ ‌return.‌
                </p>
                <p>
                    As‌ ‌an‌ ‌open‌ ‌source‌ ‌tool,‌ ‌we‌ ‌will‌ ‌continue‌ ‌to‌ ‌adjust‌ ‌quickly‌ ‌based‌ ‌on‌ ‌our‌ ‌communities‌ needs.‌ 
                    ‌Please‌ ‌let‌ ‌us‌ ‌know‌ ‌if‌ ‌you‌ ‌find‌ ‌any‌ ‌issues‌ ‌and‌ ‌we‌ ‌will‌ ‌be‌ ‌happy‌ ‌to‌ ‌update!‌
                </p>
                <p>
                    If‌ ‌you‌ ‌are‌ ‌wondering‌ ‌what‌ ‌to‌ ‌do‌ ‌with‌ ‌your‌ ‌results,‌ ‌and‌ ‌how‌ ‌you‌ ‌can‌ ‌improve,‌ ‌check‌ ‌out‌ the Responsible AI Design Assistant Guide ‌that‌ ‌includes‌ ‌definitions‌ ‌and‌ ‌lots‌ ‌of‌ additional‌ ‌information.‌ ‌
                    If‌ ‌you‌ ‌are‌ ‌in‌ ‌need‌ ‌of‌ ‌additional‌ ‌support,‌ ‌contact‌ ‌us,‌ ‌and‌ ‌we‌ ‌can‌ put‌ ‌you‌ ‌in‌ ‌touch‌ ‌with‌ ‌a‌ ‌trusted‌ ‌service‌ ‌provider.‌
                </p>
                <p>
                    Since‌ ‌we‌ ‌want‌ ‌you‌ ‌to‌ ‌use‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌early‌ ‌and‌ ‌often,‌ ‌you‌ ‌can‌ ‌click‌ ‌the‌ ‌button‌ below‌ ‌to‌ ‌start‌ ‌over‌ ‌again!‌
                </p>
                <Link to='/'>
                    <Button>Start Again</Button>
                </Link>
            </main>
        );
    }
}