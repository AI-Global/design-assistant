import React, { Component } from 'react';
import { Form, Table, InputGroup } from 'react-bootstrap';
import { grey } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';

/**
 * Component renders a Table that displays
 * the trusted AI providers that are stored in
 * the database.
 */
export default class TrustedAIResources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      filter: '',
    };
  }

  componentDidMount() {
    var endPoint = '/trustedAIResources';
    axios.get(process.env.REACT_APP_SERVER_ADDR + endPoint).then((response) => {
      const resources = response.data;
      this.setState({ resources });
    });
  }

  // set the filter for the resource names upon submission of search form
  handleSubmit(event) {
    event.preventDefault();
    let form = event.target.elements;
    let filter = form.filterResources.value;
    this.setState({ filter });
    return;
  }

  render() {
    var resources = this.state.resources;
    var filter = this.state.filter;
    return (
      <div className="report-card mt-3">
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Form.Group controlId="filterResources">
            <InputGroup className="mb-3">
              <Form.Control type="text" placeholder="Search..." />
              <InputGroup.Append>
                <IconButton size="small" color="secondary" type="submit">
                  <SearchIcon style={{ color: grey[900] }} />
                </IconButton>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Form>
        <Table
          id="trusted-ai-resources"
          bordered
          responsive
          className="report-card-table"
        >
          <thead>
            <tr role="row">
              <th
                role="columnheader"
                scope="col"
                className="report-card-headers"
              >
                <div>Trusted AI Resource</div>
              </th>
              <th
                role="columnheader"
                scope="col"
                className="report-card-headers"
              >
                <div>Description</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {resources.map(function (resource, idx) {
              if (
                filter === '' ||
                resource['resource']
                  .toLowerCase()
                  .includes(filter?.toLowerCase())
              ) {
                return (
                  <tr key={idx}>
                    <td>
                      <a href={resource['source']}>{resource['resource']}</a>
                    </td>
                    <td>{resource['description']}</td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
