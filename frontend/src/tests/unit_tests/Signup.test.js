import React from 'react';
import { fireEvent, render, screen, wait } from '@testing-library/react';
import Signup from '../views/Signup.js';
import axios from 'axios';

jest.mock('axios');

test('Signup renders successfully', async () => {
    render(<Signup/>);
    fireEvent.click(screen.getByText("Create your account"));
    await wait(() => expect(screen.getByText("User Registration")).toBeTruthy());
});

test('Signup fails email validation', async () => {
    render(<Signup/>);
    fireEvent.click(screen.getByText("Create your account"));
    let input = screen.getByLabelText("email");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    input = screen.getByLabelText("username");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    input = screen.getByLabelText("password");
    fireEvent.change(input, { target: { value: "test" } });
    input = screen.getByLabelText("confirm password");
    fireEvent.change(input, { target: { value: "test" } });
    let errors = { response: { data: { email: { isInvalid: true, message: "email already exists" } } } };
    axios.post.mockRejectedValue(errors);
    fireEvent.click(screen.getByText("Create My Account"));
    await wait(() => expect(screen.getByText("email already exists")).toBeTruthy());
});

test('Signup fails username validation', async () => {
    render(<Signup/>);
    fireEvent.click(screen.getByText("Create your account"));
    let input = screen.getByLabelText("email");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    input = screen.getByLabelText("username");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    input = screen.getByLabelText("password");
    fireEvent.change(input, { target: { value: "test" } });
    input = screen.getByLabelText("confirm password");
    fireEvent.change(input, { target: { value: "test" } });
    let errors = { response: { data: { password: { isInvalid: true, message: "weak password" } } } };
    axios.post.mockRejectedValue(errors);
    fireEvent.click(screen.getByText("Create My Account"));
    await wait(() => expect(screen.getByText("weak password")).toBeTruthy());
});


test('Signup fails confirm password validation', async () => {
    render(<Signup/>);
    fireEvent.click(screen.getByText("Create your account"));
    let input = screen.getByLabelText("email");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    input = screen.getByLabelText("username");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    input = screen.getByLabelText("password");
    fireEvent.change(input, { target: { value: "test" } });
    input = screen.getByLabelText("confirm password");
    fireEvent.change(input, { target: { value: "test" } });
    input = screen.getByLabelText("confirm password");
    fireEvent.change(input, { target: { value: "test1" } });
    fireEvent.click(screen.getByText("Create My Account"));
    await wait(() => expect(screen.getByText("Those passwords didn't match. Please try again.")).toBeTruthy());
});

test('Signup successfully passes validations and creates user', async () => {
    render(<Signup/>);
    fireEvent.click(screen.getByText("Create your account"));
    let input = screen.getByLabelText("email");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    input = screen.getByLabelText("username");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    input = screen.getByLabelText("password");
    fireEvent.change(input, { target: { value: "test" } });
    input = screen.getByLabelText("confirm password");
    fireEvent.change(input, { target: { value: "test" } });
    const user = {
        _id: "5s2s2cadadads",
        role: "member",
        email: "test@test.com",
        username: "test",
    }
    let response = {  data: { user: user } };
    axios.post.mockResolvedValue(response);
    fireEvent.click(screen.getByText("Create My Account"));
});

