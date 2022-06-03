import {
  Document,
  HeadingLevel,
  TextRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
  ImageRun,
  HeightRule,
  convertInchesToTwip,
  VerticalAlign,
} from "docx";
import { saveAs } from 'file-saver';

import { legendRisk } from "./LegendRisk";
import { mitigation } from "./Mitigation";
import { RiskBar } from './RiskBar'


const noBorders = {
  top: BorderStyle.NONE,
  right: BorderStyle.NONE,
  bottom: BorderStyle.NONE,
  left: BorderStyle.NONE,
};

const noBordersCell = {
  top: {
    style: BorderStyle.NONE,
    size: 10,
  },
  bottom: {
    style: BorderStyle.NONE,
    size: 10,
  },
  right: {
    style: BorderStyle.NONE,
    size: 10,
  },
  left: {
    style: BorderStyle.NONE,
    size: 10,
  },
};

const makeDimensions = (dimensions, subdimensions, results, questionsData) => {
  const riskImage = legendRisk(200, 41);
  const mitigationImage = mitigation(200, 41);

  const dmap = dimensions.map(dimension => {
    let questionsRows = [];
    const currentDimensionSubDimensions = subdimensions.filter(s => s.dimensionID === dimension.dimensionID);
    const subDimensionRows = currentDimensionSubDimensions.map(sb => {
      const questionsToDisplay = [];
      const sdQuestions = questionsData?.filter(q => q.subDimension === sb.subDimensionID);
      sdQuestions?.map(sdq => {
        const answer = results[sdq._id];
        if (answer) {
          if (typeof answer === 'string' && answer.match(/^[0-9a-fA-F]{24}$/)) {
            const [parsedAnswer] = sdq.responses.filter(r => r._id === answer);
            const maxScore = sdq.responses.reduce((max, r) => Math.max(max, r.score), 0);
            questionsToDisplay.push({
              question: sdq,
              answer: { value: parsedAnswer.indicator, maxScore: maxScore, answerScore: parsedAnswer.score },
            });
          } else if (Array.isArray(answer)) {
            const parsedAnswers = sdq.responses.filter(r => answer.includes(r._id)).map(pa => pa.indicator);
            const maxScore = sdq.responses.reduce((max, r) => Math.max(max, r.score), 0);
            const answerScore = parsedAnswers.reduce((sum, pa) => sum + (pa.score || 0), 0);
            questionsToDisplay.push({
              question: sdq,
              answer: { value: parsedAnswers.join(', '), maxScore, answerScore },
            });
          } else {
            questionsToDisplay.push({
              question: sdq,
              answer: { value: answer }
            });
          }
        }
        console.log('defined', questionsRows)
        questionsRows = questionsToDisplay.map(question => {
          return [
            new TableRow({
              children: [
                new TableCell({
                  width: {
                    size: 1800,
                    type: WidthType.DXA,
                  },
                  margins: {
                    bottom: convertInchesToTwip(0.69),
                  },
                  verticalAlign: VerticalAlign.TOP,
                  columnSpan: 3,
                  borders: { ...noBordersCell },
                  children: [new Paragraph({
                    children: [
                      new TextRun({ text: `${question.question.questionNumber} ${question.question.question}`, font: "Calibri", bold: false, size: 18 }),
                    ],
                  }),
                  ],
                }),
                new TableCell({
                  width: {
                    size: 1800,
                    type: WidthType.DXA,
                  },
                  margins: {
                    bottom: convertInchesToTwip(0.69),
                  },
                  verticalAlign: VerticalAlign.TOP,
                  columnSpan: 3,
                  borders: { ...noBordersCell },
                  children: [new Paragraph({
                    children: [
                      new TextRun({ text: `${question.answer.value}`, font: "Calibri", bold: false, size: 18 }),
                    ],
                  }),
                  ],
                }),
                new TableCell({
                  width: {
                    size: 1800,
                    type: WidthType.DXA,
                  },
                  margins: {
                    bottom: convertInchesToTwip(0.69),
                  },
                  verticalAlign: VerticalAlign.TOP,
                  columnSpan: 3,
                  borders: { ...noBordersCell },
                  children: [new Paragraph({
                    children: [
                      new TextRun({ text: `${question.answer.answerScore}/${question.answer.maxScore}`, font: "Calibri", bold: false, size: 18 }),
                    ],
                  }),
                  ],
                }),
                new TableCell({
                  width: {
                    size: 1800,
                    type: WidthType.DXA,
                  },
                  margins: {
                    bottom: convertInchesToTwip(0.69),
                  },
                  verticalAlign: VerticalAlign.TOP,
                  columnSpan: 3,
                  borders: { ...noBordersCell },
                  children: [new Paragraph({
                    children: [
                      new TextRun({ text: '--', font: "Calibri", bold: false, size: 18 }),
                    ],
                  }),
                  ],
                }),
                new TableCell({
                  width: {
                    size: 1800,
                    type: WidthType.DXA,
                  },
                  margins: {
                    bottom: convertInchesToTwip(0.69),
                  },
                  verticalAlign: VerticalAlign.TOP,
                  columnSpan: 3,
                  borders: { ...noBordersCell },
                  children: [new Paragraph({
                    children: [
                      new TextRun({ text: '--', font: "Calibri", bold: false, size: 18 }),
                    ],
                  }),
                  ],
                }),
              ],
            }),
          ];
        });
      });
      console.log('usage', questionsRows)
      return [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 8500,
                type: WidthType.DXA,
              },
              borders: { ...noBordersCell },
              children: [new Paragraph({
                children: [
                  new TextRun({ text: sb?.name, font: "Calibri", bold: true, size: 28 }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: sb?.description, font: "Calibri", size: 24 })]
              })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 1800,
                type: WidthType.DXA,
              },
              margins: {
                bottom: convertInchesToTwip(0.20),
              },
              verticalAlign: VerticalAlign.TOP,
              columnSpan: 3,
              borders: { ...noBordersCell },
              children: [new Paragraph({
                children: [
                  new TextRun({ text: 'Questions', font: "Calibri", bold: true, size: 18 }),
                ],
              }),
              ],
            }),
            new TableCell({
              width: {
                size: 1800,
                type: WidthType.DXA,
              },
              margins: {
                bottom: convertInchesToTwip(0.20),
              },
              verticalAlign: VerticalAlign.TOP,
              columnSpan: 3,
              borders: { ...noBordersCell },
              children: [new Paragraph({
                children: [
                  new TextRun({ text: 'Your answer', font: "Calibri", bold: true, size: 18 }),
                ],
              }),
              ],
            }),
            new TableCell({
              width: {
                size: 1800,
                type: WidthType.DXA,
              },
              margins: {
                bottom: convertInchesToTwip(0.20),
              },
              verticalAlign: VerticalAlign.TOP,
              columnSpan: 3,
              borders: { ...noBordersCell },
              children: [new Paragraph({
                children: [
                  new TextRun({ text: 'Points Earned', font: "Calibri", bold: true, size: 18 }),
                ],
              }),
              ],
            }),
            new TableCell({
              width: {
                size: 1800,
                type: WidthType.DXA,
              },
              margins: {
                bottom: convertInchesToTwip(0.20),
              },
              verticalAlign: VerticalAlign.TOP,
              columnSpan: 3,
              borders: { ...noBordersCell },
              children: [new Paragraph({
                children: [
                  new TextRun({ text: 'Recommendations', font: "Calibri", bold: true, size: 18 }),
                ],
              }),
              ],
            }),
            new TableCell({
              width: {
                size: 1800,
                type: WidthType.DXA,
              },
              margins: {
                bottom: convertInchesToTwip(0.20),
              },
              verticalAlign: VerticalAlign.TOP,
              columnSpan: 3,
              borders: { ...noBordersCell },
              children: [new Paragraph({
                children: [
                  new TextRun({ text: 'Useful Links', font: "Calibri", bold: true, size: 18 }),
                ],
              }),
              ],
            }),
          ],
        }),
        ...questionsRows.flat(),
      ]
    });
    return [
      new Table({
        columnWidths: [1800, 1800, 1800, 1800, 1800,],
        borders: { ...noBorders },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 8500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({ text: dimension.name, font: "Calibri", bold: true, size: 28 })],
                  pageBreakBefore: true,
                })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 8500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({ text: dimension.description, font: "Calibri", size: 24 })]
                })],
              }),
            ],
          }),
          new TableRow({
            height: { value: convertInchesToTwip(1), rule: HeightRule.AT_LEAST },
            children: [
              new TableCell({
                width: {
                  size: 9000,
                  type: WidthType.DXA,
                },
                margins: {
                  bottom: convertInchesToTwip(0.69),
                },
                verticalAlign: VerticalAlign.BOTTOM,
                columnSpan: 3,
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({ text: `${dimension.name} sub-dimensions:`, font: "Calibri", bold: true, size: 28 })]
                })],
              }),
            ],
          }),
          ...subDimensionRows.flat(),
        ],
      }),
    ]
  });
  return dmap.flat();
}

export const createCertificationDocx = (
  projectTitle,
  projectDescription,
  projectIndustry,
  projectRegion,
  riskLevel,
  dimensions,
  subdimensions,
  results,
  questionsData,
) => {

  const document = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: `Project Title: ${projectTitle}`, heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: projectDescription }),
        new Paragraph({ text: `Project Industry: ${projectIndustry}` }),
        new Paragraph({ text: `Project Region: ${projectRegion}` }),
        new Paragraph({ text: `Risk Level: ${riskLevel}` }),
        ...makeDimensions(dimensions, subdimensions, results, questionsData),
      ],
    }],
  });
  const file = Packer.toBlob(document).then((blob) => {
    // saveAs from FileSaver will download the file
    saveAs(blob, "Certification.docx");
  });


  return file;
}



