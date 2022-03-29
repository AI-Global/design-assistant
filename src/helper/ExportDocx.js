import {
  Document,
  HeadingLevel,
  TextRun,
  Packer,
  Paragraph,
} from "docx";
import { saveAs } from 'file-saver';

const makeDimensions = (dimensions) => {
  const dmap = dimensions.map(dimension =>
    [new Paragraph({ text: dimension.name, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ text: dimension.description })
    ]
  );
  return dmap.flat();
}

export const createCertificationDocx = async (projectTitle,
  projectDescription,
  projectIndustry,
  projectRegion,
  riskLevel, dimensions) => {
  const document = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: `Project Title: ${projectTitle}`, heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: projectDescription }),
        new Paragraph({ text: `Project Industry: ${projectIndustry}` }),
        new Paragraph({ text: `Project Region: ${projectRegion}` }),
        new Paragraph({ text: `Risk Level: ${riskLevel}` }),
        ...makeDimensions(dimensions),
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



