import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
} from "docx";



export const createCertificationDocx = (certification) => {
  const document = new Document();
  const title = new Paragraph({
    text: "Certification",
    heading: HeadingLevel.HEADING_1
  });
  const name = new Paragraph({
    text: certification.name,
    heading: HeadingLevel.HEADING_2
  });
  const provider = new Paragraph({
    text: certification.provider,
    heading: HeadingLevel.HEADING_3
  });
  const date = new Paragraph({
    text: certification.date,
    heading: HeadingLevel.HEADING_3
  });
  const description = new Paragraph({
    text: certification.description,
    heading: HeadingLevel.HEADING_3
  });
  document.addSection({
    children: [title, name, provider, date, description]
  });
  const packer = new Packer();
  const buffer = packer.toBuffer(document);
  return buffer;
}



