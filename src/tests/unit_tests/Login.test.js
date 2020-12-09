import React from 'react';
import { fireEvent, render, screen, wait } from '@testing-library/react';
import Login from '../../views/Login.js';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

const user = {
  _id: '5s2s2cadadads',
  role: 'member',
  email: 'test@test.com',
  username: 'test',
};

test('Log in button renders successfully with no user logged in', () => {
  axios.get.mockRejectedValue(new Error());
  render(
    <Router>
      <Login />
    </Router>
  );
  expect(screen.getByText('Log in')).toBeTruthy();
});

test('Logged in username renders successfully with user logged in', async () => {
  const response = { data: user };
  axios.get.mockResolvedValue(response);
  render(
    <Router>
      <Login />
    </Router>
  );
  await wait(() =>
    expect(screen.getByText(`Logged in as: ${user.username}`)).toBeTruthy()
  );
});

test('Log in button successfully transitions to login page', async () => {
  axios.get.mockRejectedValue(new Error());
  render(
    <Router>
      <Login />
    </Router>
  );
  fireEvent.click(screen.getByText('Log in'));
  expect(screen.getByLabelText('username')).toBeTruthy();
});

test('Login page fails username validations', async () => {
  axios.get.mockRejectedValue(new Error());
  render(
    <Router>
      <Login />
    </Router>
  );
  fireEvent.click(screen.getByText('Log in'));
  let input = screen.getByLabelText('username');
  fireEvent.change(input, { target: { value: 'test' } });
  input = screen.getByLabelText('password');
  fireEvent.change(input, { target: { value: 'password' } });
  let errors = {
    response: {
      data: { username: { isInvalid: true, message: 'wrong username' } },
    },
  };
  axios.post.mockRejectedValue(errors);
  fireEvent.click(screen.getByText('Login'));
  await wait(() => expect(screen.getByText('wrong username')).toBeTruthy());
});

test('Login page fails password validations', async () => {
  axios.get.mockRejectedValue(new Error());
  render(
    <Router>
      <Login />
    </Router>
  );
  fireEvent.click(screen.getByText('Log in'));
  let input = screen.getByLabelText('username');
  fireEvent.change(input, { target: { value: 'test' } });
  input = screen.getByLabelText('password');
  fireEvent.change(input, { target: { value: 'password' } });
  let errors = {
    response: {
      data: { password: { isInvalid: true, message: 'wrong password' } },
    },
  };
  axios.post.mockRejectedValue(errors);
  fireEvent.click(screen.getByText('Login'));
  await wait(() => expect(screen.getByText('wrong password')).toBeTruthy());
});

test('Login page successfully logs user in', async () => {
  axios.get.mockRejectedValue(new Error());
  render(
    <Router>
      <Login />
    </Router>
  );
  fireEvent.click(screen.getByText('Log in'));
  let input = screen.getByLabelText('username');
  fireEvent.change(input, { target: { value: 'test' } });
  input = screen.getByLabelText('password');
  fireEvent.change(input, { target: { value: 'password' } });
  let response = { data: { token: 'test-token', user: user } };
  axios.post.mockResolvedValue(response);
  fireEvent.click(screen.getByText('Login'));
});

test('Create an account button successfully transitions to signup page', async () => {
  axios.get.mockRejectedValue(new Error());
  render(
    <Router>
      <Login />
    </Router>
  );
  fireEvent.click(screen.getByText('Log in'));
  fireEvent.click(screen.getByText('Create your account'));
  await wait(() => expect(screen.getByText('User Registration')).toBeTruthy());
});
