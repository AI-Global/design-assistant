import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import App from '../App';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

const startSurveyButton = "Start New Survey";
const emptyQuestionData = "There is no visible page or question in the survey.";
const surveyWelcomeText = "Welcome";
const loginButton = "Log in"

const mockResponse = {
    data: {
        "pages": [
        ],
        "showQuestionNumbers": "false",
        "showProgressBar": "top",
        "firstPageIsStarted": "false",
        "showNavigationButtons": "false"
    }
}

const mockSubmission = {
    data: {
        _id:"5fb1055b13942f488cd50761",
        userId:null,
        projectName:"Test",
        date: new Date(),
        lifecycle:6,
        completed:false
    }
}

test('Welcome Page renders', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><App/></Router>);
    expect(screen.getByText(surveyWelcomeText)).toBeTruthy();
    expect(screen.getByText(loginButton)).toBeTruthy();
})

test('Welcome Page renders with no data', async () => {
    const emptyMockResponse = {data: [{}]};
    axios.get.mockResolvedValue(emptyMockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><App/></Router>);
    expect(screen.getByText(surveyWelcomeText)).toBeTruthy();
    expect(screen.getByText(loginButton)).toBeTruthy();
})

test('Welcome page start button transitions to Questions page', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><App/></Router>);
    
    fireEvent.click(screen.getByText(startSurveyButton));

    expect(screen.getByText(emptyQuestionData)).toBeTruthy();
    expect(screen.getByText(loginButton)).toBeTruthy();
});

test('Question Page reset button transitions to welcome page', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><App/></Router>);
    expect(screen.getByText(loginButton)).toBeTruthy();

    fireEvent.click(screen.getByText(startSurveyButton));
    expect(screen.getByText(emptyQuestionData)).toBeTruthy();
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Please Confirm"));
    fireEvent.click(screen.getByText("Yes"));
    expect(screen.getByText(surveyWelcomeText)).toBeTruthy();
});

test('Question Page finish button submits the survey', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><App/></Router>);
    expect(screen.getByText(loginButton)).toBeTruthy();

    fireEvent.click(screen.getByText(startSurveyButton));
    expect(screen.getByText(emptyQuestionData)).toBeTruthy();
});

test('Questions Page can open accoridon to navigate dimenstions', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><App/></Router>);
    expect(screen.getByText(loginButton)).toBeTruthy();

    fireEvent.click(screen.getByText(startSurveyButton));

    fireEvent.click(screen.getByText("Accountabililty"));
    fireEvent.click(screen.getByText("Nav to Accountabililty"));

    fireEvent.click(screen.getByText("Bias and Fairness"));
    fireEvent.click(screen.getByText("Nav to Bias and Fairness"));

    fireEvent.click(screen.getByText("Explainability and Interpretability"));
    fireEvent.click(screen.getByText("Nav to Explainability and Interpretability"));

    fireEvent.click(screen.getByText("Robustness"));
    fireEvent.click(screen.getByText("Nav to Robustness"));

    fireEvent.click(screen.getByText("Data Quality"));
    fireEvent.click(screen.getByText("Nav to Data Quality"));
});

test('Questions Page can open accoridon to filter select roles', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><App/></Router>);
    expect(screen.getByText(loginButton)).toBeTruthy();

    fireEvent.click(screen.getByText(startSurveyButton));

    fireEvent.click(screen.getByText("Filters"));
    expect(screen.getByText("Role")).toBeTruthy();
    expect(screen.getByText("Cycle")).toBeTruthy();
});