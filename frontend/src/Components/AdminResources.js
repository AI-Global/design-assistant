import axios from 'axios';
import React, { Component } from 'react';
import {Table, Button, Container} from 'react-bootstrap';


  
export default class AdminResources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trustedAIResources: []
        }
    }
    componentDidMount(){
        let endPoint = '/trustedAIResources'
        axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint).then(res => {
            this.setState({trustedAIResources: res.data});
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        var trustedAIResources = this.state.trustedAIResources;
        return (
            <Table bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th width="33%">Trusted AI Resource</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {trustedAIResources.map(resource => {
                        return (
                            <tr>
                                <td><a href={resource?.source}>{resource?.resource}</a></td>
                                <td>{resource?.description}</td>
                                <td><Button>Edit</Button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }
}
