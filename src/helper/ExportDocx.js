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

const riskLegend = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns:dc="http://purl.org/dc/elements/1.1/" version="1.1" xmlns:xl="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="367 305 389 80" width="389" height="80">
  <defs/>
  <g id="Canvas_1" fill-opacity="1" stroke-opacity="1" stroke-dasharray="none" fill="none" stroke="none">
    <title>Risk</title>
    <g id="Canvas_1_Risk">
      <title>Risk</title>
      <g id="Graphic_44">
        <rect x="367" y="335.8" width="77.64" height="20.166234" fill="#70d49e"/>
      </g>
      <g id="Graphic_43">
        <rect x="444.64" y="335.8" width="77.64" height="20.166234" fill="#b2e988"/>
      </g>
      <g id="Graphic_42">
        <rect x="522.28" y="335.8" width="77.64" height="20.166234" fill="#e5eb99"/>
      </g>
      <g id="Graphic_41">
        <rect x="599.92" y="335.8" width="77.64" height="20.166234" fill="#e7ce8d"/>
      </g>
      <g id="Graphic_40">
        <rect x="677.56" y="335.8" width="77.64" height="20.166234" fill="#ee999a"/>
      </g>
      <g id="Graphic_39">
        <text transform="translate(372 312.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="0" y="15">Low</tspan>
        </text>
      </g>
      <g id="Graphic_38">
        <text transform="translate(532.044 312.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4973799e-19" y="15">Medium</tspan>
        </text>
      </g>
      <g id="Graphic_37">
        <text transform="translate(717.016 312.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="11084467e-19" y="15">High</tspan>
        </text>
      </g>
      <g id="Graphic_36">
        <text transform="translate(389.364 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="1278977e-19" y="15">0-19</tspan>
        </text>
      </g>
      <g id="Graphic_35">
        <text transform="translate(462.556 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">20-39</tspan>
        </text>
      </g>
      <g id="Graphic_34">
        <text transform="translate(537.396 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">40-59</tspan>
        </text>
      </g>
      <g id="Graphic_33">
        <text transform="translate(617.836 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">60-79</tspan>
        </text>
      </g>
      <g id="Graphic_32">
        <text transform="translate(691.028 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="7673862e-19" y="15">80-100</tspan>
        </text>
      </g>
    </g>
  </g>
</svg>
`



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
            children: [new Paragraph({
              children: [new TextRun({ text: sb?.name, font: "Calibri", bold: true, size: 28 })]
            })],
          }),
          new TableCell({
            width: {
              size: 3260,
              type: WidthType.DXA,
            },
            borders: { ...noBordersCell },
            children: [new Paragraph({ children: [new TextRun({ text: "50", font: "Calibri", bold: false, size: 28 })], alignment: "center" })]
          }),
          new TableCell({
            width: {
              size: 3260,
              type: WidthType.DXA,
            },
            borders: { ...noBordersCell },
            children: [new Paragraph({ children: [new TextRun({ text: "33", font: "Calibri", bold: false, size: 28 })], alignment: "center" })]
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
              children: []
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
        children: [
          new TableCell({
            width: {
              size: 2500,
              type: WidthType.DXA,
            },
            borders: { ...noBordersCell },
            children: [new Paragraph({
              children: [new TextRun({ text: sb?.description, font: "Calibri", size: 24 })]
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
        children: [
          new TableCell({
            width: {
              size: 2500,
              type: WidthType.DXA,
            },
            borders: { ...noBordersCell },
            children: [new Paragraph({
              children: []
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
                  children: []
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
                children: [new Paragraph({
                  children: []
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
            children: [
              new TableCell({
                width: {
                  size: 2500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: []
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
                children: [new Paragraph({
                  children: []
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
            children: [
              new TableCell({
                width: {
                  size: 2500,
                  type: WidthType.DXA,
                },
                borders: { ...noBordersCell },
                children: [new Paragraph({
                  children: [new TextRun({ text: `${dimension.name} sub-dimensions score:`, font: "Calibri", bold: true, size: 28 })]
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
                  children: []
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



