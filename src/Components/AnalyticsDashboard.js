import axios from 'axios';
import React, { Component } from 'react';
import Analytic from './Analytic.js';

  
export default class AnalyticsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            analytics: false,
        }
    }

    componentDidMount() {
        var endPoint = '/analytics';
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint)
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                this.setState({ analytics: res.data?.analytics });
            })
    }

    render() {
        if (!this.state.analytics) {
            return null;
        }
        
        return (
            <div>
                {this.state.analytics.map((analytic) => (
                    <Analytic iframe={analytic.embed} key={analytic._id}/>
                ))}
                
            </div>
        )
    }
}



