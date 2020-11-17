import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import App from '../App';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

const startSurveyButton = "Start New Survey";
const emptyQuestionData = "There is no visible page or question in the survey.";
const surveyWelcomeText = "Welcome";

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
})

test('Welcome Page renders with no data', async () => {
    const emptyMockResponse = {data: [{}]};
    axios.get.mockResolvedValue(emptyMockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><App/></Router>);
    expect(screen.getByText(surveyWelcomeText)).toBeTruthy();
})