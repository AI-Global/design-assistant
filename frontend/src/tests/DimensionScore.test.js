import React from 'react';
import { queryByText, render } from '@testing-library/react';
import DimensionScore from '../views/DimensionScore'
import {Table} from 'react-bootstrap';

const mockQuestions = [{
    "type": "radiogroup",
    "name": "Q1",
    "score": {
        "dimension": "R",
        "choices": {
            "1": 1.0,
            "2": 2.0,
            "3": 3.0,
            "4": 4.0
        }
    }
}]

test('Dimension Score successfully renders', () => {
    var radarChartData = [];
    var questions = [];
    var mockResults = {"Q1": "1"};
    var dimensionName = "R";
    const {queryByText} = render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={mockQuestions}
         results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(queryByText("R")).toBeTruthy();
});

test('Dimension Score successfully renders with no data', () => {
    var radarChartData = [];
    var mockResults = {};
    var dimensionName = "R";
    const {queryByText} = render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={[]}
         results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(queryByText("R")).toBeTruthy();
})

// dimension score == 25%
test('Dimension Score successfully marks "Needs to improve"', () => {
    var radarChartData = [];
    var mockResults = {"Q1": "1"};
    var dimensionName = "R";
    const {getByTitle} = render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={mockQuestions}
        results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(getByTitle("improve true")).toBeTruthy();
    expect(getByTitle("acceptable false")).toBeTruthy();
    expect(getByTitle("proficient false")).toBeTruthy();
});

// dimension score == 50%
test('Dimension Score successfully marks "Acceptable"', () => {
    var radarChartData = [];
    var mockResults = {"Q1": "2"};
    var dimensionName = "R";
    const {getByTitle} = render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={mockQuestions}
        results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(getByTitle("improve false")).toBeTruthy();
    expect(getByTitle("acceptable true")).toBeTruthy();
    expect(getByTitle("proficient false")).toBeTruthy();
});

// dimension score == 100%
test('Dimension Score successfully marks "Proficient"', () => {
    var radarChartData = [];
    var mockResults = {"Q1": "4"};
    var dimensionName = "R";
    const {getByTitle} = render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={mockQuestions}
        results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(getByTitle("improve false")).toBeTruthy();
    expect(getByTitle("acceptable false")).toBeTruthy();
    expect(getByTitle("proficient true")).toBeTruthy();
});