import React, { useState, useEffect } from 'react'
import api from '../api';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import ApexBar from '../Components/ApexBar';

import { computeSubdimensionScore, computeDimensionScores } from '../helper/ScoreHelper';

const getSubDimensionApexData = (subDimensions, questions, results) => {
  let data = [];
  subDimensions.forEach(subDimension => {
    let subScore = computeSubdimensionScore(subDimension, questions, results);
    let { earned, available } = subScore;
    const benchmark = available / 2;
    let apexData = {
      x: subDimension.name,
      y: earned,
      goals: [
        {
          name: 'Available',
          value: available === 0 ? 98 : available,
          strokeWidth: 5,
          strokeHeight: 10,
          strokeColor: '#D9D4DE'
        }
      ]
    };
    data.push(apexData);
  });

  return ({

    series: [
      {
        name: 'Earned',
        data
      }
    ],
    options: {
      chart: {
        height: '20px',
        type: 'bar',
        toolbar: {
          show: false,
          tools: {
            download: false,
          }
        },
        fontFamily: 'Roboto',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      colors: ['#3F73FB'],
      dataLabels: {
        formatter: function (val, opt) {
          const goals =
            opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex]
              .goals

          if (goals && goals.length) {
            return `${val} / ${goals[0].value}`
          }
          return val
        }
      },
      legend: {
        show: false,
        showForSingleSeries: true,
        customLegendItems: ['Earned', 'Available'],
        markers: {
          fillColors: ['#3F73FB', '#D9D4DE']
        }
      },
      grid: {
        show: false,
      },
      xaxis: {
        labels: {
          show: false
        }
      },
      noData: {
        text: 'No data',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: '#000000',
          fontSize: '14px',
        }
      }
    },


  }
  )
}

const getDimensionApexData = (dimensions, subDimensions, questions, results) => {
  console.log(subDimensions, dimensions)
  const scores = computeDimensionScores(dimensions, subDimensions, questions, results);
  console.log(scores);

  return ({

    series: [
      {
        name: 'Earned',
        data: [
          {
            x: '2011',
            y: 12,
            goals: [
              {
                name: 'Expected',
                value: 14,
                strokeWidth: 2,
                strokeDashArray: 2,
                strokeColor: '#775DD0'
              }
            ]
          },
          {
            x: '2012',
            y: 44,
            goals: [
              {
                name: 'Expected',
                value: 54,
                strokeWidth: 5,
                strokeHeight: 10,
                strokeColor: '#775DD0'
              }
            ]
          },
          {
            x: '2013',
            y: 54,
            goals: [
              {
                name: 'Expected',
                value: 52,
                strokeWidth: 10,
                strokeHeight: 0,
                strokeLineCap: 'round',
                strokeColor: '#775DD0'
              }
            ]
          },
          {
            x: '2014',
            y: 66,
            goals: [
              {
                name: 'Expected',
                value: 61,
                strokeWidth: 10,
                strokeHeight: 0,
                strokeLineCap: 'round',
                strokeColor: '#775DD0'
              }
            ]
          },
          {
            x: '2015',
            y: 81,
            goals: [
              {
                name: 'Expected',
                value: 66,
                strokeWidth: 10,
                strokeHeight: 0,
                strokeLineCap: 'round',
                strokeColor: '#775DD0'
              }
            ]
          },
          {
            x: '2016',
            y: 67,
            goals: [
              {
                name: 'Expected',
                value: 70,
                strokeWidth: 5,
                strokeHeight: 10,
                strokeColor: '#775DD0'
              }
            ]
          }
        ]
      }
    ],
    options: {
      chart: {
        height: '20px',
        type: 'bar',
        toolbar: {
          show: false,
          tools: {
            download: false,
          }
        },
        fontFamily: 'Roboto',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      colors: ['#3F73FB'],
      dataLabels: {
        formatter: function (val, opt) {
          const goals =
            opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex]
              .goals

          if (goals && goals.length) {
            return `${val} / ${goals[0].value}`
          }
          return val
        }
      },
      legend: {
        show: false,
        showForSingleSeries: true,
        customLegendItems: ['Earned', 'Available'],
        markers: {
          fillColors: ['#3F73FB', '#D9D4DE']
        }
      },
      grid: {
        show: false,
      },
      xaxis: {
        labels: {
          show: false
        }
      },
      noData: {
        text: 'No data',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: '#000000',
          fontSize: '14px',
        }
      }
    },


  }
  )
}

const WrappedApex = ({ subDimensions, questions, results }) => {
  const { options, series, type, width } = getSubDimensionApexData(subDimensions, questions, results);
  return <ApexBar options={options} series={series} type={"bar"} width={400} />
}

const WrappedDimensionApex = ({ dimensions, subDimensions, questions, results }) => {
  const { options, series, type, width } = getDimensionApexData(dimensions, subDimensions, questions, results);
  return <ApexBar options={options} series={series} type={"bar"} width={400} />
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
            {dimensions && <WrappedDimensionApex dimensions={dimensions} subDimensions={dimensions} questions={questions} results={results} />}
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
                    <div style={{ height: `${subDimensionsList.length * 50}px` }}>
                      {/* {questions && <WrappedBar subDimensions={subDimensionsList} questions={questions} results={results} />} */}
                      {questions && <WrappedApex subDimensions={subDimensionsList} questions={questions} results={results} />}
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

