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
          name: 'Benchmark',
          value: benchmark,
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
          barHeight: '80%',
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
      yaxis: {
        show: true,
        labels: {
          show: true,
          align: 'right',
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
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
  console.log('Computed dimension scores: ', scores);
  const earned = scores.map(score => {
    return { x: score.dimension.name, y: score.earned, goals: [{ name: 'Benchmark', value: score.available / 2 }] }
  });
  const available = scores.map(score => {
    return { x: score.dimension.name, y: score.available }
  });
  console.log('Earned: ', earned);
  console.log('Available: ', available);

  return ({

    series: [
      {
        name: 'Earned',
        data: earned
      },
      {
        name: 'Available',
        data: available
      }
    ],
    options: {
      chart: {
        height: '20px',
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
          tools: {
            download: false,
          }
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      colors: ['#3F73FB', '#D9D4DE'],
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
        show: true,
        position: 'top',
        horizontalAlign: 'right',
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
      yaxis: {
        show: true,
        labels: {
          show: true,
          align: 'right',
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
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
  }
  )
}

const WrappedApex = ({ subDimensions, questions, results }) => {
  const { options, series, type, width } = getSubDimensionApexData(subDimensions, questions, results);
  return <ApexBar options={options} series={series} type={"bar"} width={400} />
}

const WrappedDimensionApex = ({ dimensions, subDimensions, questions, results }) => {
  const { options, series } = getDimensionApexData(dimensions, subDimensions, questions, results);
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
          <ListGroup style={{ marginBottom: '25px', height: `${dimensions.length * 50}px` }}>
            {dimensions && questions && subDimensions && results && <WrappedDimensionApex dimensions={dimensions} subDimensions={subDimensions} questions={questions} results={results} />}
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

