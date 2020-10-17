import React, { Component } from 'react';
import {Table} from 'react-bootstrap'
import axios from 'axios';

/**
 * Component renders a Table that displays
 * the trusted AI providers that are stored in 
 * the database. 
 */
export default class TrustedAIProviders extends Component{
    constructor(props){
        super(props);
        this.state = {
            providers: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:9000/trustedAIProviders')
            .then(response => {
                const providers = response.data;
                this.setState({ providers });
            })
    }

    render (){
        var providers = this.state.providers;
        return (
            <div className="report-card mt-3">
                <Table id="trusted-ai-providers" bordered responsive className="report-card-table">
                    <thead>
                        <tr role="row">
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Trusted AI Provider
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
                        {providers.map(function(provider, idx) {
                            return ( 
                                <tr key={idx}>
                                    <td>
                                        <a href={provider["source"]}>{provider["resource"]}</a>
                                    </td>
                                    <td>
                                        {provider["description"]}
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