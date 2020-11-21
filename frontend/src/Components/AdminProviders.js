import axios from 'axios';
import React, { Component } from 'react';
import {Table, Button} from 'react-bootstrap';
import EditModal from './EditModal';


  
export default class AdminProviders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trustedAIProviders: []
        }
    }
    componentDidMount(){
        let endPoint = '/trustedAIProviders'
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint).then(res => {
            this.setState({trustedAIProviders: res.data});
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        var trustedAIProviders = this.state.trustedAIProviders;
        return (
            <Table bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th width="33%">Trusted AI Provider</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {trustedAIProviders.map(provider => {
                        return (
                            <tr>
                                <td><a href={provider?.source}>{provider?.resource}</a></td>
                                <td>{provider?.description}</td>
                                <td><EditModal/></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }
}
