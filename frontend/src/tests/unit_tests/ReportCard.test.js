import React from 'react';
import {render, screen} from '@testing-library/react';
import ReportCard from '../views/ReportCard';

const mockQuestions = [{
    "type": "radiogroup",
    "name": "Q1",
    "score": {
        "dimension": "R"
    },
    "title": {
        "default": "Mock Survey Question",
    },
    "recommendation": {
        "default": "recommendation"
    },
    "choices": [
        {
            "value": "1",
            "text": {
                "default": "Yes",
                "fr": ""
            }
        },
        {
            "value": "2",
            "text": {
                "default": "No",
                "fr": ""
            }
        }
    ]
}];

test('Report Card renders', () => {
    var mockResults = {"Q1":"1"};
    var dimensionName = "R";
    render(<ReportCard questions={mockQuestions}
         results={mockResults} dimensionName={dimensionName}/>);
    expect(screen.queryByText(mockQuestions[0]["title"]["default"])).toBeTruthy();
});

test('Report Card renders with no data', () => {
    var mockResults = {};
    var dimensionName = "R";
    render(<ReportCard questions={[]}
         results={mockResults} dimensionName={dimensionName}/>);
    expect(screen.queryByText("Question")).toBeTruthy();
})


