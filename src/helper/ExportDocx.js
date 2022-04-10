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

const makeDimensions = (dimensions, subdimensions) => {
  const image = legendRisk(200, 41);
  const dmap = dimensions.map(dimension => {
    const currentDimensionSubDimensions = subdimensions.filter(s => s.dimensionID === dimension.dimensionID);
    const subDimensionRows = currentDimensionSubDimensions.map(sb => [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 2500,
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
          new TableCell({
            width: {
              size: 3260,
              type: WidthType.DXA,
            },
            borders: { ...noBordersCell },
            children: [new Paragraph({ children: [new ImageRun({ data: RiskBar(200, 41, Math.floor(Math.random() * 101), 'risk'), transformation: { width: 200, height: 41 } })] })],
          }),
          new TableCell({
            width: {
              size: 3260,
              type: WidthType.DXA,
            },
            borders: { ...noBordersCell },
            children: [new Paragraph({ children: [new ImageRun({ data: RiskBar(200, 41, Math.floor(Math.random() * 101), 'mitigation'), transformation: { width: 200, height: 41 } })] })],
          }),
        ],
      }),
    ]);
    return [
      new Table({
        columnWidths: [2500, 3260, 3260],
        borders: { ...noBorders },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 2500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({ text: dimension.name, font: "Calibri", bold: true, size: 28 })],
                  pageBreakBefore: true,
                })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({ text: 'Risk Scores', font: "Calibri", bold: true, size: 28 })]
                })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({ text: 'Mitigation Scores', font: "Calibri", bold: true, size: 28 })]
                })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 2500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({ text: dimension.description, font: "Calibri", size: 24 })]
                })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({ children: [new ImageRun({ data: image, transformation: { width: 200, height: 41 } })] })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({ children: [new ImageRun({ data: image, transformation: { width: 200, height: 41 } })] })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 2500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({
                    text: 'Total Score', font: "Calibri", bold: true, size: 28
                  })]
                })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [],
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
                  children: [new TextRun({ text: `${dimension.name} sub-dimensions score:`, font: "Calibri", bold: true, size: 28 })]
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
  subdimensions) => {

  const document = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: `Project Title: ${projectTitle}`, heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: projectDescription }),
        new Paragraph({ text: `Project Industry: ${projectIndustry}` }),
        new Paragraph({ text: `Project Region: ${projectRegion}` }),
        new Paragraph({ text: `Risk Level: ${riskLevel}` }),
        ...makeDimensions(dimensions, subdimensions),
      ],
    }],
  });
  const file = Packer.toBlob(document).then((blob) => {
    // saveAs from FileSaver will download the file
    saveAs(blob, "Certification.docx");
  });


  return file;
}



