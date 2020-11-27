import React from 'react';
import { fireEvent, render, screen, wait } from '@testing-library/react';
import axios from 'axios';
import AdminProviders from '../../Components/AdminProviders.js';

jest.mock('axios');

const mockProviders = {
    data: [{
        _id: "39e8de37d3j",
        resource: "Old Provider",
        description: "Description",
        source: "Old Source"

    }]
}

const returnMockProvider = {
    data: {
        _id: "39e8de37d3j",
        resource: "New Provider",
        description: "New Description",
        source: "New Source"
    }
}


test('Admin Trusted AI Providers renders successfully', async () => {
    axios.get.mockResolvedValue(mockProviders)
    await render(<AdminProviders />);
    expect(screen.getAllByText('Trusted AI Provider')).toBeTruthy();
});

test('Admin Trusted AI Providers renders successfully with no data', async () => {
    const response = { data: [] }
    axios.get.mockResolvedValue(response)
    await render(<AdminProviders />);
    expect(screen.getAllByText('Trusted AI Provider')).toBeTruthy();
});

test('Admin Trusted AI Providers create new button opens edit modal', async () => {
    const response = { data: [] }
    axios.get.mockResolvedValue(response)
    await render(<AdminProviders />);
    fireEvent.click(screen.getByLabelText("add provider"));
    expect(screen.getByText('Title')).toBeTruthy();
});

test('Admin Trusted AI Providers edit button opens edit modal', async () => {
    axios.get.mockResolvedValue(mockProviders)
    await render(<AdminProviders />);
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText('Title')).toBeTruthy();
});

test('Admin Trusted AI Providers edit modal successfully submits new provider', async () => {
    const response = { data: [] };
    axios.get.mockResolvedValue(response);
    axios.put.mockResolvedValue(returnMockProvider);
    await render(<AdminProviders />);
    fireEvent.click(screen.getByLabelText("add provider"));
    let input = screen.getByLabelText("Title");
    fireEvent.change(input, { target: { value: "New Provider" } });
    input = screen.getByLabelText("Description");
    fireEvent.change(input, { target: { value: "New Description" } });
    input = screen.getByLabelText("Source");
    fireEvent.change(input, { target: { value: "New Source" } });
    fireEvent.click(screen.getByText("Save"));
    await wait(() => expect(screen.getByText("New Provider")).toBeTruthy());
});

test('Admin Trusted AI Providers edit modal fails source validation', async () => {
    const response = { data: [] };
    axios.get.mockResolvedValue(response);
    let errors = { response: { data: { source: { isInvalid: true, message: "Trusted AI Provider with source already exists." } } } };
    axios.put.mockRejectedValue(errors);
    await render(<AdminProviders />);
    fireEvent.click(screen.getByLabelText("add provider"));
    let input = screen.getByLabelText("Title");
    fireEvent.change(input, { target: { value: "New Provider" } });
    input = screen.getByLabelText("Description");
    fireEvent.change(input, { target: { value: "New Description" } });
    input = screen.getByLabelText("Source");
    fireEvent.change(input, { target: { value: "Old Source" } });
    fireEvent.click(screen.getByText("Save"));
    await wait(() => expect(screen.getByText("Trusted AI Provider with source already exists.")).toBeTruthy());
});

test('Admin Trusted AI Providers edit modal successfully updates provider', async () => {
    const response = { data: [] };
    axios.get.mockResolvedValue(mockProviders);
    axios.put.mockResolvedValue(returnMockProvider);
    await render(<AdminProviders />);
    fireEvent.click(screen.getByText("Edit"));
    let input = screen.getByLabelText("Title");
    fireEvent.change(input, { target: { value: "New Provider" } });
    input = screen.getByLabelText("Description");
    fireEvent.change(input, { target: { value: "New Description" } });
    input = screen.getByLabelText("Source");
    fireEvent.change(input, { target: { value: "New Source" } });
    fireEvent.click(screen.getByText("Save"));
    await wait(() => expect(screen.getByText("New Provider")).toBeTruthy());
    expect(screen.queryByText("Old Provider")).toBeFalsy();
});
