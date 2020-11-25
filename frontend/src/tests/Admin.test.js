import React from 'react';
import { render, screen} from '@testing-library/react';
import axios from 'axios';
import Admin from '../views/Admin';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

const adminWelcomeText = "Administration Panel";
const surveyManagmentText = "Survey Management"
const usersText = "Users"
const analyticsText = "Analytics"
const loginButton = "Log in"

const mockDB = {
    data: {
        "questions": [
            {"_id":"5fa50df9d17b20d5d45df4fe","questionNumber":1,"__v":0,"alt_text":null,"domainApplicability":null,"lifecycle":6,"mandatory":true,"parent":null,"pointsAvailable":0,"prompt":null,"question":"Title of project","questionType":"tombstone","reference":null,"regionalApplicability":null,"responseType":"text","responses":[],"roles":[13],"trustIndexDimension":null,"weighting":0,"trigger":{"responses":[]}}
        ],
        "dimensions" : [{
            "_id": {
              "$oid": "5f9899e7d17b20d5d4cf0015"
            },
            "dimensionID": 0,
            "__v": 0,
            "label": "A",
            "name": "Accountability"
          }],
        "analytics" : [],
    }
}



test('Admin Page renders', async () => {
    const emptyMockDB = { data: {"questions":[], "dimensions" : [], "analytics": [] } };
    axios.get.mockResolvedValue(emptyMockDB);

    await render(<Router><Admin/></Router>);

    expect(screen.getByText(loginButton)).toBeTruthy();

    expect(screen.getByText(adminWelcomeText)).toBeTruthy();
    expect(screen.getByText(surveyManagmentText)).toBeTruthy();
    expect(screen.getByText(usersText)).toBeTruthy();
    expect(screen.getByText(analyticsText)).toBeTruthy();
    
})

test('Admin Page renders survey management', async () => {
    axios.get.mockResolvedValue(mockDB);
    await render(<Router><Admin/></Router>);

    expect(screen.getByText(loginButton)).toBeTruthy();
    expect(screen.getByText(adminWelcomeText)).toBeTruthy();
    expect(screen.getByText(surveyManagmentText)).toBeTruthy();
    expect(screen.getByText(usersText)).toBeTruthy();
    expect(screen.getByText(analyticsText)).toBeTruthy();
    expect(screen.getByLabelText("add question")).toBeTruthy();

    expect(screen.getByText("Title of project")).toBeTruthy();
    expect(screen.getByText("Details")).toBeTruthy();
    expect(screen.getByText("Edit")).toBeTruthy();

})
