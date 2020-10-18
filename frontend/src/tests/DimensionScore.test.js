import React from 'react';
import {render, screen} from '@testing-library/react';
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

test('Dimension Score renders', () => {
    var radarChartData = [];
    var mockResults = {"Q1": "1"};
    var dimensionName = "R";
    render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={mockQuestions}
         results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(screen.queryByText("R")).toBeTruthy();
});

test('Dimension Score renders with no data', () => {
    var radarChartData = [];
    var mockResults = {};
    var dimensionName = "R";
    render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={[]}
         results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(screen.queryByText("R")).toBeTruthy();
})

// dimension score == 25%
test('Dimension Score marks "Needs to improve"', () => {
    var radarChartData = [];
    var mockResults = {"Q1": "1"};
    var dimensionName = "R";
    render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={mockQuestions}
        results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(screen.getByLabelText("improve true")).toBeTruthy();
    expect(screen.getByLabelText("acceptable false")).toBeTruthy();
    expect(screen.getByLabelText("proficient false")).toBeTruthy();
});

// dimension score == 50%
test('Dimension Score marks "Acceptable"', () => {
    var radarChartData = [];
    var mockResults = {"Q1": "2"};
    var dimensionName = "R";
    render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={mockQuestions}
        results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(screen.getByLabelText("improve false")).toBeTruthy();
    expect(screen.getByLabelText("acceptable true")).toBeTruthy();
    expect(screen.getByLabelText("proficient false")).toBeTruthy();
});

// dimension score == 100%
test('Dimension Score marks "Proficient"', () => {
    var radarChartData = [];
    var mockResults = {"Q1": "4"};
    var dimensionName = "R";
    render(<Table><thead></thead><tbody><DimensionScore radarChartData={radarChartData} questions={mockQuestions}
        results={mockResults} dimensionName={dimensionName}/></tbody></Table>);
    expect(screen.getByLabelText("improve false")).toBeTruthy();
    expect(screen.getByLabelText("acceptable false")).toBeTruthy();
    expect(screen.getByLabelText("proficient true")).toBeTruthy();
});