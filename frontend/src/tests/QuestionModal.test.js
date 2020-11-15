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

test('Question Modal renders with Project Details question', () => {
    render(<Router><QuestionModal show={true} question={mockTombstoneQuestion} dimensions={mockDimensions} /></Router>);

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
    expect(screen.queryByText("Link")).toBeFalsy();
})

test('Question Modal renders with survey Risk question', () => {
    render(<Router><QuestionModal show={true} question={mockRiskQuestion} dimensions={mockDimensions} /></Router>);

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
    expect(screen.queryByText("Link")).toBeTruthy();
})

test('Question Modal renders with new question', () => {
    render(<Router><QuestionModal show={true} question={mockNewQuestion} dimensions={mockDimensions} /></Router>);

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
