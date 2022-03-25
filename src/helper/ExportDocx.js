import {
  Document,
  HeadingLevel,
  TextRun,
  Packer,
  Paragraph,
} from "docx";

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
  const b64string = await Packer.toBase64String(document);
  console.log('Base64String:', b64string);
  return b64string
  // const packer = new Packer();
  // const buffer = packer.toBuffer(document);
  // return buffer;
}



