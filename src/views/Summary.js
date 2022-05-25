import React, { useState, useEffect } from 'react'
import api from '../api';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import NivoBullet from '../Components/NivoBullet';
import { computeSubdimensionScore } from '../helper/ScoreHelper';


const getSubDimensionData = (subDimensions, questions, results) => {
  let data = [];
  subDimensions.forEach(subDimension => {
    let subScore = computeSubdimensionScore(subDimension, questions, results);
    // console.log(`Subdimension: ${subDimension.subDimensionID}`, 'Score: ', subScore);
    let { earned, available } = subScore;
    const benchmark = available / 2;
    let subDimensionData = {
      id: subDimension.name,
      ranges: [available],
      measures: [earned],
      markers: [benchmark]
    };
    data.push(subDimensionData);
  });
  // console.log('Subdimension data: ', data);
  return data;
}


export default function Summary({ dimensions, results, subDimensions, submission }) {
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    api
      .get(`submissions/submission/${submission?._id}`)
      .then((res) => {
        const submissionFromAPI = res.data.submission;
      });
    api.get('questions/all').then((res) => {
      setQuestions(res.data.questions)
    });
  }, []);
  return (
    <Container>
      <p style={{
        fontSize: '32px',
        fontWeight: 700,
      }}>
        Dimensions
      </p>
      <Row>
        <Col>
          <ListGroup style={{ marginBottom: '25px' }}>
            {dimensions.map(d => (
              <ListGroup.Item style={{ borderWidth: '0px', padding: '0px' }} key={d.dimensionID}>{d.name}</ListGroup.Item>
            ))}
          </ListGroup>
          <ListGroup style={{ marginBottom: '20px' }}>
            {dimensions.map(d => {
              const subDimensionsList = subDimensions.filter(sd => sd.dimensionID === d.dimensionID);
              return (
                <ListGroup.Item style={{ borderWidth: '0px', paddingLeft: '0px' }} key={d.dimensionID}>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: 700,
                  }}>
                    {d.name}
                  </p>
                  <ListGroup>
                    <div style={{ height: '600px', width: '75vw' }} >
                      {questions && <NivoBullet data={getSubDimensionData(subDimensionsList, questions, results)} />}
                    </div>
                  </ListGroup>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

