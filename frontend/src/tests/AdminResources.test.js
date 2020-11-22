import React from 'react';
import { fireEvent, render, screen, wait } from '@testing-library/react';
import axios from 'axios';
import AdminResources from '../Components/AdminResources.js';

jest.mock('axios');

const mockResources = {
    data: [{
        _id: "39e8de37d3j",
        resource: "Old Resource",
        description: "Description",
        source: "Old Source"

    }]
}

const returnMockResource = {
    data: {
        _id: "39e8de37d3j",
        resource: "New Resource",
        description: "New Description",
        source: "New Source"
    }
}


test('Admin Trusted AI Resources renders successfully', async () => {
    axios.get.mockResolvedValue(mockResources)
    await render(<AdminResources />);
    expect(screen.getAllByText('Trusted AI Resource')).toBeTruthy();
});

test('Admin Trusted AI Resources renders successfully with no data', async () => {
    const response = { data: [] }
    axios.get.mockResolvedValue(response)
    await render(<AdminResources />);
    expect(screen.getAllByText('Trusted AI Resource')).toBeTruthy();
});

test('Admin Trusted AI Resources create new button opens edit modal', async () => {
    const response = { data: [] }
    axios.get.mockResolvedValue(response)
    await render(<AdminResources />);
    fireEvent.click(screen.getByLabelText("add resource"));
    expect(screen.getByText('Title')).toBeTruthy();
});

test('Admin Trusted AI Resources edit button opens edit modal', async () => {
    axios.get.mockResolvedValue(mockResources)
    await render(<AdminResources />);
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText('Title')).toBeTruthy();
});

test('Admin Trusted AI Resources edit modal successfully submits new resource', async () => {
    const response = { data: [] };
    axios.get.mockResolvedValue(response);
    axios.put.mockResolvedValue(returnMockResource);
    await render(<AdminResources />);
    fireEvent.click(screen.getByLabelText("add resource"));
    let input = screen.getByLabelText("Title");
    fireEvent.change(input, { target: { value: "New Resource" } });
    input = screen.getByLabelText("Description");
    fireEvent.change(input, { target: { value: "New Description" } });
    input = screen.getByLabelText("Source");
    fireEvent.change(input, { target: { value: "New Source" } });
    fireEvent.click(screen.getByText("Save"));
    await wait(() => expect(screen.getByText("New Resource")).toBeTruthy());
});

test('Admin Trusted AI Resources edit modal fails source validation', async () => {
    const response = { data: [] };
    axios.get.mockResolvedValue(response);
    let errors = { response: { data: { source: { isInvalid: true, message: "Trusted AI Resource with source already exists." } } } };
    axios.put.mockRejectedValue(errors);
    await render(<AdminResources />);
    fireEvent.click(screen.getByLabelText("add resource"));
    let input = screen.getByLabelText("Title");
    fireEvent.change(input, { target: { value: "New Resource" } });
    input = screen.getByLabelText("Description");
    fireEvent.change(input, { target: { value: "New Description" } });
    input = screen.getByLabelText("Source");
    fireEvent.change(input, { target: { value: "Old Source" } });
    fireEvent.click(screen.getByText("Save"));
    await wait(() => expect(screen.getByText("Trusted AI Resource with source already exists.")).toBeTruthy());
});

test('Admin Trusted AI Resources edit modal successfully updates resource', async () => {
    const response = { data: [] };
    axios.get.mockResolvedValue(mockResources);
    axios.put.mockResolvedValue(returnMockResource);
    await render(<AdminResources />);
    fireEvent.click(screen.getByText("Edit"));
    let input = screen.getByLabelText("Title");
    fireEvent.change(input, { target: { value: "New Resource" } });
    input = screen.getByLabelText("Description");
    fireEvent.change(input, { target: { value: "New Description" } });
    input = screen.getByLabelText("Source");
    fireEvent.change(input, { target: { value: "New Source" } });
    fireEvent.click(screen.getByText("Save"));
    await wait(() => expect(screen.getByText("New Resource")).toBeTruthy());
    expect(screen.queryByText("Old Resource")).toBeFalsy();
});
