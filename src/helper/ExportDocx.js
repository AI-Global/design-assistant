import {
  Document,
  HeadingLevel,
  TextRun,
  Packer,
  Paragraph,
} from "docx";
import { saveAs } from 'file-saver';


export const createCertificationDocx = async () => {
  const document = new Document({
    sections: [{
      properties: {},
      children: [
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



