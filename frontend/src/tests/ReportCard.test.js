import React from 'react';
import {toBeInTheDocument,toHaveStyle} from '@testing-library/jest-dom';
import {render } from '@testing-library/react';
import ReportCard from '../views/ReportCard';

expect.extend({ toBeInTheDocument, toHaveStyle });
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

test('Report Card successfully renders', () => {
    var mockResults = {"Q1":"1"};
    var dimensionName = "R";
    const {queryByText} = render(<ReportCard questions={mockQuestions}
         results={mockResults} dimensionName={dimensionName}/>);
    expect(queryByText(mockQuestions[0]["title"]["default"])).toBeTruthy();
});

test('Report Card successfully renders with no data', () => {
    var mockResults = {};
    var dimensionName = "R";
    const {queryByText} = render(<ReportCard questions={[]}
         results={mockResults} dimensionName={dimensionName}/>);
    expect(queryByText("Question")).toBeTruthy();
})


