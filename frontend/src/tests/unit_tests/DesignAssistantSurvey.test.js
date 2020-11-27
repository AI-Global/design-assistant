import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import DesignAssistantSurvey from '../../views/DesignAssistantSurvey.js';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

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

const mockResponse = {
    data: {
        dimensions:['Bias and Fairness'],
        roles:[],
        domain:[],
        region:[],
        lifecycle:[],
        "pages": [{
            "name":"page1",
            "title":{"default":"Page 1","fr":""},
            "elements":[
                {"title":
                {"default":"","fr":""},
                "name":"5fafa2fdd17b20d5d48c38e6","type":"text"}
            ]},
            {
                "name":"page2",
                "title":{"default":"Page 2","fr":""},
                "elements":[
                    {"title":
                    {"default":"","fr":""},
                    "name":"5fafa2fdd17b20d5d48c38e6","type":"text"}
                ]}],
        "showQuestionNumbers": "false",
        "showProgressBar": "top",
        "firstPageIsStarted": "false",
        "showNavigationButtons": "false",
        _id:"5f4f48c38e6"
    }
}

test('Survey Renders', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    expect(screen.getByText('Page 1')).toBeTruthy();

});

test('Survey Page reset button pops modal to return to Home page', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    expect(screen.getByText('Page 1')).toBeTruthy();

    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Please Confirm"));
    fireEvent.click(screen.getByText("Yes"));
});

test('Survey Page Next button renders page 2', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    expect(screen.getByText('Page 1')).toBeTruthy();

    fireEvent.click(screen.getByText("Next"));    

    expect(screen.getByText('Page 2')).toBeTruthy();
});

test('Survey Page finish button submits the survey', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    expect(screen.getByText('Page 1')).toBeTruthy();
    expect(screen.getByText('undefined')).toBeTruthy();

    fireEvent.click(screen.getByText("Finish"));
    
});

test('Survey Page can open accoridon to navigate dimenstions', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);

    fireEvent.click(screen.getByText("Bias and Fairness"));
});

test('Survey Page can open accoridon to filter select roles', async () => {
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue(mockSubmission);
    await render(<Router><DesignAssistantSurvey/></Router>);
    
    fireEvent.click(screen.getByText("Filters"));

    await expect(screen.getByText("Roles")).toBeTruthy();
    await expect(screen.getByText("Apply Filters")).toBeTruthy();
});