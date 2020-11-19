import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import DesignAssistantSurvey from '../views/DesignAssistantSurvey.js';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

const mockResponse = {
    data: {
        "pages": [{
            "name":"projectDetails1",
            "title":{"default":"Project Details","fr":""},
            "elements":[
                {"title":
                {"default":"undefined","fr":""},
                "name":"5fafa2fdd17b20d5d48c38e6","type":"text"}
            ]}]
        ,
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

test('Survey Renders', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    expect(screen.getByText('Project Details')).toBeTruthy();
    expect(screen.getByText('undefined')).toBeTruthy();
});

test('Survey Page reset button pops modal to return to Home page', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    expect(screen.getByText('Project Details')).toBeTruthy();
    expect(screen.getByText('undefined')).toBeTruthy();

    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Please Confirm"));
    fireEvent.click(screen.getByText("Yes"));
});

test('Survey Page Next button renders page 2', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    expect(screen.getByText('Project Details')).toBeTruthy();
    expect(screen.getByText('undefined')).toBeTruthy();

    fireEvent.click(screen.getByText("Next"));    
});

test('Survey Page finish button submits the survey', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    expect(screen.getByText('Project Details')).toBeTruthy();
    expect(screen.getByText('undefined')).toBeTruthy();

    fireEvent.click(screen.getByText("Finish"));
    
});

test('Survey Page can open accoridon to navigate dimenstions', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);

    fireEvent.click(screen.getByText("Bias and Fairness"));
    fireEvent.click(screen.getByText("Nav to Bias and Fairness"));

    fireEvent.click(screen.getByText("Explainability and Interpretability"));
    fireEvent.click(screen.getByText("Nav to Explainability and Interpretability"));

    fireEvent.click(screen.getByText("Robustness"));
    fireEvent.click(screen.getByText("Nav to Robustness"));

    fireEvent.click(screen.getByText("Data Quality"));
    fireEvent.click(screen.getByText("Nav to Data Quality"));
});

test('Survey Page can open accoridon to filter select roles', async () => {
    axios.get.mockResolvedValue(mockResponse);
    // axios.post.mockResolvedValue(mockSubmiss/ion);
    await render(<Router><DesignAssistantSurvey/></Router>);

    fireEvent.click(screen.getByText("Filters"));
    expect(screen.getByText("Role")).toBeTruthy();
    expect(screen.getByText("Cycle")).toBeTruthy();
});