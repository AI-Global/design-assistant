import React, { Component } from 'react';
import {Table} from 'react-bootstrap'
import axios from 'axios';
require('dotenv').config()

/**
 * Component renders a Table that displays
 * the trusted AI providers that are stored in 
 * the database. 
 */
export default class TrustedAIResources extends Component{
    constructor(props){
        super(props);
        this.state = {
            resources: []
        }
    }

    componentDidMount() {
        var endPoint = '/trustedAIResources';
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .then(response => {
                const resources = response.data;
                this.setState({ resources });
            })
    }

    render (){
        var resources = this.state.resources;
        return (
            <div className="report-card mt-3">
                <Table id="trusted-ai-resources" bordered responsive className="report-card-table">
                    <thead>
                        <tr role="row">
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Trusted AI Resource
                                </div>
                            </th>
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Description
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map(function(resource, idx) {
                            return ( 
                                <tr key={idx}>
                                    <td>
                                        <a href={resource["source"]}>{resource["resource"]}</a>
                                    </td>
                                    <td>
                                        {resource["description"]}
                                    </td>
                                </tr>
                            )

                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}