import React from 'react';
import { render } from '@testing-library/react';
import TrustedAIProviders from '../views/TrustedAIProviders';
import axios from 'axios';

jest.mock('axios');

test('Trusted AI Providers successfully renders', () => {
    const source = "source"
    const resource = "resource";
    const description = "ai provider";
    const data = [{"source": source,
                "resource": resource,
                "description": description
                }];
    const response = {data: data};
    axios.get.mockResolvedValue(response);
    const {queryByText} = render(<TrustedAIProviders/>);
    expect(queryByText("Trusted AI Provider")).toBeTruthy();
});

test('Trusted AI Providers successfully renders with no data', () => {
    const data = [];
    const response = {data: data};
    axios.get.mockResolvedValue(response);
    const {queryByText} = render(<TrustedAIProviders/>);
    expect(queryByText("Trusted AI Provider")).toBeTruthy();
});