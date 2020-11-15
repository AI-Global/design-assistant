import React from 'react';
import { fireEvent,render, screen } from '@testing-library/react';
import QuestionModal from '../Components/QuestionModal';
import { BrowserRouter as Router } from 'react-router-dom';

const mockTombstoneQuestion = {
    "_id": "5fa50df9d17b20d5d45df4fe",
    "questionNumber": 1,
    "__v": 0,
    "alt_text": null,
    "domainApplicability": null,
    "lifecycle": 6,
    "mandatory": true,
    "parent": null,
    "pointsAvailable": 0,
    "prompt": null,
    "question": "Title of project",
    "questionType": "tombstone",
    "reference": null,
    "regionalApplicability": null,
    "responseType": "text",
    "responses": [],
    "roles": [13],
    "trustIndexDimension": null,
    "weighting": 0,
    "trigger": { "responses": [] }
}

const mockRiskQuestion = {
    "_id": "5fa50dfed17b20d5d45df750",
    "questionNumber": 10,
    "_v": 0,
    "alt_text": "Vulnerable Populations: There are several definitions available for the term b\u0000\u001cvulnerable populationb\u0000\u001d, the words simply imply the disadvantaged sub-segment of the community[1] requiring utmost care, specific ancillary considerations and augmented protections in research. The vulnerable individualsb\u0000\u0019 freedom and capability to protect one-self from intended or inherent risks is variably abbreviated, from decreased freewill to inability to make informed choices (NCBI)\r",
    "domainApplicability": null,
    "lifecycle": 6,
    "mandatory": true,
    "parent": null,
    "pointsAvailable": 1,
    "prompt": null,
    "question": "Is your user base comprised of individuals or groups from vulnerable populations?",
    "questionType": "risk",
    "reference": "Reference from AI Principles for Vulnerable Populations in Humanitarian Contexts: There are many recent examples of Artificial Intelligence (AI) systems being used for vulnerable people in humanitarian and disaster response contexts, with serious ethical and security-related implications. In particular, vulnerable populations are put at further risk through biases inherently built into AI systems. There are security concerns regarding their personal information being exposed and even used for persecution purposes.",
    "regionalApplicability": null,
    "responseType": "radiogroup",
    "responses": [{ "_id": { "$oid": "5fac1a38d10a490ecdbe1b7d" }, "responseNumber": 0, "indicator": "Yes - Most users will be individuals or groups from vulnerable populations", "score": -1 }, { "_id": { "$oid": "5fac1a4ad10a490ecdbe1b84" }, "responseNumber": 1, "indicator": "Yes - Some users will be individuals or groups from vulnerable populations", "score": 0 }, { "_id": { "$oid": "5fac1a38d10a490ecdbe1b7f" }, "responseNumber": 2, "indicator": "No - There are currently no identified vulnerable populations in the user base", "score": 1 }],
    "roles": [13],
    "trustIndexDimension": 2,
    "weighting": 3,
    "trigger": { "responses": [] }
}

const mockNewQuestion = {
    "questionNumber": 3,
    "__v": 0,
    "alt_text": null,
    "domainApplicability": null,
    "lifecycle": 6,
    "mandatory": true,
    "parent": null,
    "pointsAvailable": 0,
    "prompt": null,
    "question": null,
    "questionType": "tombstone",
    "reference": null,
    "regionalApplicability": null,
    "responseType": "text",
    "responses": [],
    "roles": [13],
    "trustIndexDimension": null,
    "weighting": 0
}

const mockDimensions = [{
    "_id": {
        "$oid": "5f9899e7d17b20d5d4cf0015"
    },
    "dimensionID": 0,
    "__v": 0,
    "label": "A",
    "name": "Accountability"
}, {
    "_id": {
        "$oid": "5f9899e8d17b20d5d4cf003e"
    },
    "dimensionID": 1,
    "__v": 0,
    "label": "EI",
    "name": "Explainability and Interpretability"
}]

const mockMetaData = {
    "domain":[{"_id":"5fa50de3d17b20d5d45dec87","domainID":1,"__v":0,"name":"Health"},{"_id":"5fa50de3d17b20d5d45dec97","domainID":2,"__v":0,"name":"Insurance"},{"_id":"5fa50de3d17b20d5d45deca8","domainID":3,"__v":0,"name":"Banking"},{"_id":"5fa50de3d17b20d5d45decbc","domainID":4,"__v":0,"name":"Media"},{"_id":"5fa50de4d17b20d5d45decce","domainID":5,"__v":0,"name":"Retail"},{"_id":"5fa50de4d17b20d5d45decdc","domainID":6,"__v":0,"name":"Other"}],
    "lifecycle":[{"_id":"5fa50dcfd17b20d5d45de1d4","lifecycleID":1,"__v":0,"name":"Plan and Design"},{"_id":"5fa50dcfd17b20d5d45de1eb","lifecycleID":2,"__v":0,"name":"Data and Model"},{"_id":"5fa50dcfd17b20d5d45de203","lifecycleID":3,"__v":0,"name":"Verify and Validate"},{"_id":"5fa50dcfd17b20d5d45de219","lifecycleID":4,"__v":0,"name":"Deploy"},{"_id":"5fa50dcfd17b20d5d45de22d","lifecycleID":5,"__v":0,"name":"Operate and Monitor"},{"_id":"5fa50dd0d17b20d5d45de23d","lifecycleID":6,"__v":0,"name":"All"}],
    "region":[{"_id":"5fa50d2ad17b20d5d45d96ea","regionID":1,"__v":0,"name":"Africa"},{"_id":"5fa50d2ad17b20d5d45d96fa","regionID":2,"__v":0,"name":"Antarctica"},{"_id":"5fa50d2bd17b20d5d45d970a","regionID":3,"__v":0,"name":"Asia"},{"_id":"5fa50d2bd17b20d5d45d9718","regionID":4,"__v":0,"name":"Europe"},{"_id":"5fa50d2bd17b20d5d45d972c","regionID":5,"__v":0,"name":"North America"},{"_id":"5fa50d2bd17b20d5d45d973a","regionID":6,"__v":0,"name":"South America"},{"_id":"5fa50d2bd17b20d5d45d974a","regionID":7,"__v":0,"name":"Oceania"},{"_id":"5fa50d2bd17b20d5d45d976a","regionID":8,"__v":0,"name":"Other"}],
    "roles":[{"_id":"5fb162a2d17b20d5d440e6cb","roleID":1,"__v":0,"name":"Product Owner / Business Owner"},{"_id":"5fb162a2d17b20d5d440e6e2","roleID":2,"__v":0,"name":"Risk Management"},{"_id":"5fb162a2d17b20d5d440e6f1","roleID":3,"__v":0,"name":"Legal Lead"},{"_id":"5fb162a2d17b20d5d440e708","roleID":4,"__v":0,"name":"IT Lead"},{"_id":"5fb162a2d17b20d5d440e718","roleID":5,"__v":0,"name":"Technical Manager"},{"_id":"5fb162a2d17b20d5d440e729","roleID":6,"__v":0,"name":"Software Engineer / Software Developer"},{"_id":"5fb162a2d17b20d5d440e73f","roleID":7,"__v":0,"name":"Product Design"},{"_id":"5fb162a2d17b20d5d440e757","roleID":8,"__v":0,"name":"Data Scientist Lead"},{"_id":"5fb162a2d17b20d5d440e775","roleID":9,"__v":0,"name":"Machine Learning Engineer"},{"_id":"5fb162a2d17b20d5d440e785","roleID":10,"__v":0,"name":"Researcher"},{"_id":"5fb162a2d17b20d5d440e791","roleID":11,"__v":0,"name":"Non Government Organization Volunteer"},{"_id":"5fb162a2d17b20d5d440e79f","roleID":12,"__v":0,"name":"Policy Analyst"},{"_id":"5fb162a3d17b20d5d440e7b0","roleID":13,"__v":0,"name":"All"}]
}


test('Question Modal renders with Project Details question', () => {
    render(<Router><QuestionModal show={true} question={mockTombstoneQuestion} dimensions={mockDimensions} metadata={mockMetaData} /></Router>);

    expect(screen.getByText("Edit Question")).toBeTruthy();
    expect(screen.getByText("Details")).toBeTruthy();
    expect(screen.getByText("text")).toBeTruthy();
    expect(screen.getByText("tombstone")).toBeTruthy();
    expect(screen.getByText("Title of project")).toBeTruthy();

    expect(screen.queryByText("Points")).toBeFalsy();
    expect(screen.queryByText("Weight")).toBeFalsy();
    expect(screen.queryByText("Role")).toBeFalsy(); // This entire row renders together, so if 'Role' is not visible, neither are any of the sections
    expect(screen.queryByText("Responses")).toBeFalsy();
    expect(screen.queryByText("Score")).toBeFalsy();
    expect(screen.queryByText("Reference")).toBeFalsy();
    // expect(screen.queryByText("Link")).toBeFalsy();
})

test('Question Modal renders with survey Risk question', () => {
    render(<Router><QuestionModal show={true} question={mockRiskQuestion} dimensions={mockDimensions} metadata={mockMetaData}/></Router>);

    expect(screen.getByText("Edit Question")).toBeTruthy();
    expect(screen.getByText("Details")).toBeTruthy();
    expect(screen.getByText("text")).toBeTruthy();
    expect(screen.getByText("risk")).toBeTruthy();

    expect(screen.queryByText("Points")).toBeTruthy();
    expect(screen.queryByText("Weight")).toBeTruthy();
    expect(screen.queryByText("Role")).toBeTruthy(); // This entire row renders together, so if 'Role' is visible, so are any of the sections
    expect(screen.queryByText("Responses")).toBeTruthy();
    expect(screen.queryByText("Score")).toBeTruthy();
    expect(screen.queryByText("Reference")).toBeTruthy();
    // expect(screen.queryByText("Link")).toBeTruthy();
})

test('Question Modal renders with new question', () => {
    render(<Router><QuestionModal show={true} question={mockNewQuestion} dimensions={mockDimensions} metadata={mockMetaData}/></Router>);

    expect(screen.getByText("Edit Question")).toBeTruthy();
    expect(screen.getByText("Details")).toBeTruthy();
    expect(screen.getByText("text")).toBeTruthy();
    expect(screen.getByText("tombstone")).toBeTruthy();
    expect(screen.queryByText("Responses")).toBeFalsy();
    expect(screen.queryByText("Score")).toBeFalsy();
    expect(screen.queryByText("Role")).toBeFalsy();


    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Please enter a question")).toBeTruthy();

    // type in new question
    expect(screen.queryByText("New Question")).toBeFalsy();
    fireEvent.change(screen.getByTestId("question"), {target: {value: "New Question"}})
    expect(screen.getByText("New Question")).toBeTruthy();

    // change reponse type to radiogroup and expect new responses and score columns
    fireEvent.change(screen.getByTestId("responseType"), {target : {value: "radiogroup"}})
    expect(screen.queryByText("Responses")).toBeTruthy();
    expect(screen.queryByText("Score")).toBeTruthy();

    // change question type to risk and expect new roles etc. row
    fireEvent.change(screen.getByTestId("questionType"), {target : {value: "risk"}})
    expect(screen.queryByText("Role")).toBeTruthy();
})
