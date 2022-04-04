import {
  Document,
  HeadingLevel,
  TextRun,
  Packer,
  Paragraph,
  Header,
} from "docx";
import { saveAs } from 'file-saver';


const makeSubDimensions = (dimensionId, subDimensions) => {
  const subDimensionsToDisplay = subDimensions.filter(d => d.dimensionID === dimensionId);
  return subDimensionsToDisplay.map(d => {
    return new Paragraph({ text: d.name, heading: HeadingLevel.HEADING_3 });
  })
};

const makeDimensions = (dimensions, subDimensions) => {
  const dmap = dimensions.map(dimension =>
    [
      new Paragraph({ text: dimension.name, heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
      new Paragraph({ text: dimension.description }),
      ...makeSubDimensions(dimension.dimensionID, subDimensions)
    ]
  );
  return dmap.flat();
}

export const createCertificationDocx = (projectTitle,
  projectDescription,
  projectIndustry,
  projectRegion,
  riskLevel, dimensions, subDimensions) => {
  const document = new Document({
    sections: [{
      properties: {},
      headers: {
        default: new Header({
          children: [
            new Paragraph({ text: "Responsible Artificial Intelligence Institute", alignment: "center" }),
          ],
        })
      },
      children: [
        new Paragraph({ text: projectTitle || 'Untitled', style: "Title" }),
        new Paragraph({ text: projectDescription }),
        new Paragraph({ text: `Project Industry: ${projectIndustry}` }),
        new Paragraph({ text: `Project Region: ${projectRegion}` }),
        new Paragraph({ text: `Risk Level: ${riskLevel}` }),
        ...makeDimensions(dimensions, subDimensions),
        new Paragraph({
          children: [
            new TextRun("Hello World"),
            new TextRun({
              text: "Foo Bar",
              bold: true,
            }),
            new TextRun({
              text: "\tGithub is the best",
              bold: true,
            }),
          ],
        }),
      ],
    }],
  });
  const file = Packer.toBlob(document).then((blob) => {
    // saveAs from FileSaver will download the file
    saveAs(blob, "Certification.docx");
  });
  return file;
}



