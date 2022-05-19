import React, { useState, useEffect } from 'react'
import api from '../api';
import { Table, Container, Row, Col, ListGroup } from 'react-bootstrap';

export default function Summary({ dimensions, results, questions, subDimensions, submission }) {
  const [questionsData, serQuestionsData] = useState(null);

  useEffect(() => {
    api
      .get(`submissions/submission/${submission?._id}`)
      .then((res) => {
        const submissionFromAPI = res.data.submission;
      });
    api.get('questions/all').then((res) => {
      serQuestionsData(res.data.questions)
    });
  }, []);
  console.log(dimensions, subDimensions)

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
              <ListGroup.Item style={{ borderWidth: '0px', padding: '0px' }}>{d.name}</ListGroup.Item>
            ))}
          </ListGroup>
          <ListGroup style={{ marginBottom: '20px' }}>
            {dimensions.map(d => {
              const subDimensionsList = subDimensions.filter(sd => sd.dimensionID === d.dimensionID);
              return (
                <ListGroup.Item style={{ borderWidth: '0px', paddingLeft: '0px' }}>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: 700,
                  }}>
                    {d.name}
                  </p>
                  <ListGroup>
                    {subDimensionsList.map(sd => (
                      <ListGroup.Item style={{ borderWidth: '0px', padding: '0px' }}>{sd.name}</ListGroup.Item>
                    ))}
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

