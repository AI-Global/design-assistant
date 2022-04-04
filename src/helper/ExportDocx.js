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
  BorderStyle
} from "docx";
import { saveAs } from 'file-saver';

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
            children: [new Paragraph({ text: sb?.name, heading: HeadingLevel.HEADING_3 })],
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
        children: [
          new TableCell({
            width: {
              size: 2500,
              type: WidthType.DXA,
            },
            borders: { ...noBordersCell },
            children: [new Paragraph({ text: sb?.description })],
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
                children: [new Paragraph({ text: dimension.name, heading: HeadingLevel.HEADING_3, pageBreakBefore: true })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({ text: 'Risk Scores', heading: HeadingLevel.HEADING_3 })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({ text: 'Mitigation Scores', heading: HeadingLevel.HEADING_3 })],
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
                children: [new Paragraph({ text: dimension.description })],
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
            children: [
              new TableCell({
                width: {
                  size: 2500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({ text: 'Total Score', heading: HeadingLevel.HEADING_3 })],
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
            children: [
              new TableCell({
                width: {
                  size: 2500,
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
            children: [
              new TableCell({
                width: {
                  size: 2500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({ text: `${dimension.name} sub-dimensions score:`, heading: HeadingLevel.HEADING_3 })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({ text: 'Risk Scores', heading: HeadingLevel.HEADING_3 })],
              }),
              new TableCell({
                width: {
                  size: 3260,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({ text: 'Mitigation Scores', heading: HeadingLevel.HEADING_3 })],
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



