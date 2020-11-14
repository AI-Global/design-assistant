import React from 'react';
import { fireEvent, render, screen, wait } from '@testing-library/react';
import UserSettings from '../views/UserSettings.js';
import axios from 'axios';

jest.mock('axios');

const user = {
    _id: "5fae2bbc6591d482788ad733",
    role: "member",
    email: "micheal.le.nguyen@gmail.com",
    username: "micheal.le.nguyen@gmail.com",
}

test('User Settings renders successfully', () => {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    render(<UserSettings />);
    expect(screen.getByLabelText("Settings Dropdown")).toBeTruthy();
});

test('User Settings transitions to Change Email successfully', () => {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Email"));
    expect(screen.getByText("Submit")).toBeTruthy();
});

test('User Settings submit Change Email fails validation', async () =>  {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    const component = render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Email"));
    let input = screen.getByLabelText("new email");
    fireEvent.change(input, { target: { value: "test@hotmail.com" }});
    input = screen.getByLabelText("current password");
    fireEvent.change(input, { target: { value: "test" }});
    let errors = {response: {data: {email: {isInvalid: true, message: "Invalid Email"}}}};
    axios.post.mockRejectedValue(errors);
    fireEvent.click(screen.getByText("Submit"));
    await wait(() => expect(screen.getByText("Invalid Email")).toBeTruthy());
    
});

test('User Settings submit Change Email passes validation', async () =>  {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    const component = render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Email"));
    let input = screen.getByLabelText("new email");
    fireEvent.change(input, { target: { value: "test@hotmail.com" }});
    input = screen.getByLabelText("current password");
    fireEvent.change(input, { target: { value: "test" }});
    axios.post.mockResolvedValue(response);
    fireEvent.click(screen.getByText("Submit"));
});


test('User Settings transitions to Change Username successfully', () => {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Username"));
    expect(screen.getByText("Submit")).toBeTruthy();
    
});

test('User Settings submit Change Username fails validation', async () =>  {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    const component = render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Username"));
    let input = screen.getByLabelText("new username");
    fireEvent.change(input, { target: { value: "test" }});
    input = screen.getByLabelText("current password");
    fireEvent.change(input, { target: { value: "test" }});
    let errors = {response: {data: {username: {isInvalid: true, message: "Invalid Username"}}}};
    axios.post.mockRejectedValue(errors);
    fireEvent.click(screen.getByText("Submit"));
    await wait(() => expect(screen.getByText("Invalid Username")).toBeTruthy());
    
});

test('User Settings submit Change Username passes validation', async () =>  {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    const component = render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Username"));
    let input = screen.getByLabelText("new username");
    fireEvent.change(input, { target: { value: "test" }});
    input = screen.getByLabelText("current password");
    fireEvent.change(input, { target: { value: "test" }});
    axios.post.mockResolvedValue(response);
    fireEvent.click(screen.getByText("Submit"));
});

test('User Settings transitions to Change Password successfully', () => {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Password"));
    expect(screen.getByText("Submit")).toBeTruthy();
});

test('User Settings submit Change Password fails validation', async () =>  {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    const component = render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Password"));
    let input = screen.getByLabelText("current password");
    fireEvent.change(input, { target: { value: "test" }});
    input = screen.getByLabelText("new password");
    fireEvent.change(input, { target: { value: "test" }});
    input = screen.getByLabelText("confirm password");
    fireEvent.change(input, { target: { value: "test" }});
    let errors = {response: {data: {newPassword: {isInvalid: true, message: "Weak Password"}}}};
    axios.post.mockRejectedValue(errors);
    fireEvent.click(screen.getByText("Submit"));
    await wait(() => expect(screen.getByText("Weak Password")).toBeTruthy());
    
});

test('User Settings submit Change Password passes validation', async () =>  {
    const response = { data: user };
    axios.get.mockResolvedValue(response);
    const component = render(<UserSettings />);
    fireEvent.click(screen.getByLabelText("Settings Dropdown"));
    fireEvent.click(screen.getByText("Change Password"));
    let input = screen.getByLabelText("current password");
    fireEvent.change(input, { target: { value: "test" }});
    input = screen.getByLabelText("new password");
    fireEvent.change(input, { target: { value: "test" }});
    input = screen.getByLabelText("current password");
    fireEvent.change(input, { target: { value: "test" }});
    axios.post.mockResolvedValue(response);
    fireEvent.click(screen.getByText("Submit"));
});
