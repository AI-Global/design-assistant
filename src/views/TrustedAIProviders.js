import React, { Component } from 'react';
import { Form, Table, InputGroup } from 'react-bootstrap';
import { grey } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import api from '../api';

/**
 * Component renders a Table that displays
 * the trusted AI providers that are stored in
 * the database.
 */
export default class TrustedAIProviders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providers: [],
      filter: '',
    };
  }

  componentDidMount() {
    api.get('trustedAIProviders').then((response) => {
      const providers = response.data;
      this.setState({ providers });
    });
  }

  // set the filter for the provider names upon submission of search form
  handleSubmit(event) {
    event.preventDefault();
    let form = event.target.elements;
    let filter = form.filterProviders.value;
    this.setState({ filter });
    return;
  }

  render() {
    var providers = this.state.providers;
    var filter = this.state.filter;
    return (
      <div className="report-card mt-3">
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Form.Group controlId="filterProviders">
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
          id="trusted-ai-providers"
          bordered
          responsive
          className="report-card-table"
        >
          <thead>
            <tr role="row">
              <th
                role="columnheader"
                scope="col"
                className="score-card-headers"
              >
                Trusted AI Provider
              </th>
              <th
                role="columnheader"
                scope="col"
                className="score-card-headers"
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {providers.map(function (provider, idx) {
              if (
                filter === '' ||
                provider['resource']
                  .toLowerCase()
                  .includes(filter?.toLowerCase())
              ) {
                return (
                  <tr key={idx}>
                    <td>
                      <a href={provider['source']} target="_blank" rel="noopener noreferrer">{provider['resource']}</a>
                    </td>
                    <td>{provider['description']}</td>
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
